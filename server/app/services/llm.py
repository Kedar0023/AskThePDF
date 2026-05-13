
from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model


def get_model():
    """Lazily initialize the LLM so it's only created when actually needed."""
    return init_chat_model(
        model="gemini-2.5-flash",
        model_provider="google_genai",
        temperature=0.7,
    )


sysPrompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are a helpful assistant.
Answer ONLY from the provided transcript context.
If the context is insufficient, say "I don't know."
Transcript:
{context}"""),

    ("human","Question: {question}")
])