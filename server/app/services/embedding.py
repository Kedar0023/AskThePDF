from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from app.services.load_document import load_pdf_documents


CHROMA_DB_DIR = "./vector_store"


def store_pdf_embeddings(file_path: str):

    documents = load_pdf_documents(file_path)

    # embedding model
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )


    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR
    )

    return vector_store