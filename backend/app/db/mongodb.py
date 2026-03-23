from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from dotenv import load_dotenv

from app.models.user_log import HistorySummary, PregnancyLogInput, PregnancyLogResponse, RiskSeverity, TrendPoint


# Load environment variables from backend/.env when available.
load_dotenv()


MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "pregnancy_monitor")

client: AsyncIOMotorClient | None = None
database = None


async def connect_to_mongo() -> None:
    global client, database
    client = AsyncIOMotorClient(MONGODB_URL)
    database = client[MONGODB_DB]


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()
        client = None


def get_logs_collection() -> AsyncIOMotorCollection:
    if database is None:
        raise RuntimeError("MongoDB connection is not initialized.")
    return database["pregnancy_logs"]


def serialize_log(document: dict[str, Any]) -> PregnancyLogResponse:
    input_payload = document["input"]
    assessment_payload = document["assessment"]
    return PregnancyLogResponse(
        id=str(document["_id"]),
        created_at=document["created_at"],
        input=PregnancyLogInput.model_validate(input_payload),
        assessment=assessment_payload,
    )


async def save_log(log_input: PregnancyLogInput, assessment) -> PregnancyLogResponse:
    collection = get_logs_collection()
    payload = {
        "created_at": datetime.now(timezone.utc),
        "input": log_input.model_dump(mode="json"),
        "assessment": assessment.model_dump(mode="json"),
    }
    result = await collection.insert_one(payload)
    created = await collection.find_one({"_id": result.inserted_id})
    return serialize_log(created)


async def list_logs(limit: int = 30) -> list[PregnancyLogResponse]:
    collection = get_logs_collection()
    cursor = collection.find().sort("created_at", -1).limit(limit)
    documents = await cursor.to_list(length=limit)
    return [serialize_log(document) for document in documents]


def risk_to_score(risk: RiskSeverity) -> int:
    return {
        RiskSeverity.LOW: 1,
        RiskSeverity.MODERATE: 2,
        RiskSeverity.HIGH: 3,
    }[risk]


async def get_history_summary(limit: int = 14) -> HistorySummary:
    collection = get_logs_collection()
    documents = await collection.find().sort("created_at", -1).limit(limit).to_list(length=limit)
    risks = [document["assessment"]["overall_risk"] for document in documents]
    trend = [
        TrendPoint(
            date=document["created_at"].astimezone(timezone.utc).date().isoformat(),
            risk=document["assessment"]["overall_risk"],
            score=risk_to_score(document["assessment"]["overall_risk"]),
        )
        for document in reversed(documents)
    ]
    return HistorySummary(
        total_logs=len(documents),
        high_risk_count=risks.count(RiskSeverity.HIGH),
        moderate_risk_count=risks.count(RiskSeverity.MODERATE),
        low_risk_count=risks.count(RiskSeverity.LOW),
        trend=trend,
    )
