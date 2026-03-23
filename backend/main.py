from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.db.mongodb import close_mongo_connection, connect_to_mongo


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="FetalSense",
    version="0.1.0",
    description=(
        "Rule-based maternal risk monitoring with safe explanation and multilingual output. "
        "This system is decision support only and not a diagnosis service."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
