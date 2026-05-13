from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.services.llm import get_model, sysPrompt
from app.services.retriever import get_retriever


def format_docs(docs):
    """Flatten retrieved documents into a single context string."""
    return "\n\n".join(doc.page_content for doc in docs)


def get_rag_chain():
    """
    Build and return a RAG chain that accepts chat_history:
      1. Retriever fetches relevant chunks from ChromaDB
      2. Chunks are formatted into a context string
      3. Prompt template slots in context + chat_history + user question
      4. LLM generates the answer
      5. Output parser extracts the string response
    """
    retriever = get_retriever()
    model = get_model()

    rag_chain = (
        RunnablePassthrough.assign(
            context=lambda x: format_docs(retriever.invoke(x["question"]))
        )
        | sysPrompt
        | model
        | StrOutputParser()
    )

    return rag_chain
