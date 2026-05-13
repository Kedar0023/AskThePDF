import os
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from load_dotenv import load_dotenv

from app.routes.route import router

# ─── Bootstrap ─────────────────────────────────────────────────────────────────

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)

app = FastAPI(
    title="AskThePDF API",
    description="Upload PDFs and ask questions — powered by LangChain RAG",
    version="0.1.0",
)

# ─── CORS (allow the frontend to call the API) ────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ────────────────────────────────────────────────────────────────────

app.include_router(router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "AskThePDF API is running"}
