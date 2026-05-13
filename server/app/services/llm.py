
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chat_models import init_chat_model


def get_model():
    """Lazily initialize the LLM so it's only created when actually needed."""
    return init_chat_model(
        model="gemini-2.5-flash",
        model_provider="google_genai",
        temperature=0.3,
    )


sysPrompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """\
You are a precise PDF Q&A assistant. Follow these rules strictly:

1. Answer ONLY using the provided context below. Never use outside knowledge.
2. Keep answers short, direct, and to the point — ideally 1-3 sentences.
3. Use bullet points for lists; avoid unnecessary elaboration.
4. If the context doesn't contain enough information, reply exactly: "I don't have enough information in the uploaded PDF to answer that."
5. When quoting the document, cite the page number if available.
6. Never repeat the question back. Never add disclaimers or filler text.

Context from PDF:
{context}""",
    ),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}"),
])