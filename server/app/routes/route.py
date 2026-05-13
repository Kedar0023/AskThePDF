import os
import uuid
import shutil
import logging

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.models.user import ChatRequest, ChatResponse, SourceDocument
from app.services.embedding import store_pdf_embeddings
from app.services.chain import get_rag_chain
from app.services.retriever import get_retriever

logger = logging.getLogger(__name__)

router = APIRouter()

UPLOAD_DIR = "./uploads"


# ─── PDF Upload ────────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file, save it to disk, then embed its content
    into the ChromaDB vector store so it can be queried later.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF files are accepted.",
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Save the uploaded PDF to disk
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.error("Failed to save uploaded file: %s", e)
        raise HTTPException(status_code=500, detail="Failed to save the uploaded file.")

    # Generate embeddings and store in ChromaDB
    try:
        store_pdf_embeddings(file_path)
    except Exception as e:
        logger.error("Embedding failed for %s: %s", file.filename, e)
        raise HTTPException(status_code=500, detail=f"Failed to process the PDF: {e}")

    return {
        "filename": file.filename,
        "message": "PDF uploaded and embedded successfully. You can now ask questions about it.",
    }


# ─── Chat (RAG) ───────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(data: ChatRequest):
    """
    Send a question and get an answer grounded in the uploaded PDF(s).
    Uses the RAG chain: retriever → prompt → LLM → answer.
    """
    try:
        rag_chain = get_rag_chain()
        answer = rag_chain.invoke(data.message)
    except Exception as e:
        logger.error("RAG chain error: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {e}")

    # Also retrieve the source documents for transparency
    try:
        retriever = get_retriever()
        docs = retriever.invoke(data.message)
        sources = [
            SourceDocument(
                content=doc.page_content[:500],  # truncate for response size
                page=doc.metadata.get("page"),
                source=doc.metadata.get("source"),
            )
            for doc in docs
        ]
    except Exception:
        sources = []

    session_id = data.session_id or str(uuid.uuid4())

    return ChatResponse(
        answer=answer,
        session_id=session_id,
        sources=sources,
    )


# ─── Health ────────────────────────────────────────────────────────────────────

@router.get("/health")
async def health():
    """Simple health-check endpoint."""
    return {"status": "ok"}