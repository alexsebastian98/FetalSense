from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.db.mongodb import get_history_summary, list_logs, save_log
from app.models.user_log import HistorySummary, PregnancyLogInput, PregnancyLogResponse
from app.services.risk_engine import assess_risk


router = APIRouter()


@router.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/api/logs", response_model=PregnancyLogResponse)
async def create_log(log_input: PregnancyLogInput) -> PregnancyLogResponse:
    assessment = assess_risk(log_input)
    try:
        return await save_log(log_input, assessment)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/api/logs", response_model=list[PregnancyLogResponse])
async def get_logs(limit: int = Query(default=30, ge=1, le=100)) -> list[PregnancyLogResponse]:
    try:
        return await list_logs(limit=limit)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/api/history/summary", response_model=HistorySummary)
async def history_summary(limit: int = Query(default=14, ge=1, le=90)) -> HistorySummary:
    try:
        return await get_history_summary(limit=limit)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
