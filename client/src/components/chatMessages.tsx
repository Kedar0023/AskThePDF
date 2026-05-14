import { cn } from "@/lib/utils";
import { IconFileText } from "@tabler/icons-react";
import { useState, useCallback } from "react";
import PromptBox from "@/components/PromptBox";
import TypingIndicator from "./typingIndicator";

/* ─── Types ─────────────────────────────────────────────────────── */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ─── Demo data ─────────────────────────────────────────────────── */

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "demo-1",
    role: "user",
    content: "What is this document about?",
    timestamp: new Date("2026-05-14T09:00:00"),
  },
  {
    id: "demo-2",
    role: "assistant",
    content:
      "This PDF covers the fundamentals of machine learning, including supervised and unsupervised learning techniques, neural network architectures, and practical applications in natural language processing and computer vision.",
    timestamp: new Date("2026-05-14T09:00:05"),
  },
  {
    id: "demo-3",
    role: "user",
    content: "Can you summarize the key points from chapter 3?",
    timestamp: new Date("2026-05-14T09:01:00"),
  },
  {
    id: "demo-4",
    role: "assistant",
    content:
      'Chapter 3 focuses on neural network architectures. The key points are:\n\n• **Feedforward Networks** — the simplest architecture where data flows in one direction from input to output.\n• **Convolutional Neural Networks (CNNs)** — designed for image recognition tasks using convolutional and pooling layers.\n• **Recurrent Neural Networks (RNNs)** — handle sequential data like text and time series through feedback connections.\n• **Transformers** — the modern architecture using self-attention mechanisms, powering models like GPT and BERT.',
    timestamp: new Date("2026-05-14T09:01:08"),
  },
  {
    id: "demo-5",
    role: "user",
    content: "What does the document say about transformers specifically?",
    timestamp: new Date("2026-05-14T09:02:00"),
  },
  {
    id: "demo-6",
    role: "assistant",
    content:
      'The document describes transformers as a breakthrough architecture introduced in the 2017 paper "Attention Is All You Need." It highlights that transformers rely entirely on self-attention mechanisms, eliminating the need for recurrence. This enables massive parallelization during training, making them significantly faster to train on large datasets compared to RNNs and LSTMs.',
    timestamp: new Date("2026-05-14T09:02:10"),
  },
];

/* ─── Hook: chat messages state ─────────────────────────────────── */

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  return { messages, isLoading, setIsLoading, clearMessages, addMessage, setMessages };
}

/* ─── MessageBubble ─────────────────────────────────────────────── */

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex items-start">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <IconFileText className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

/* ─── ChatPanel (messages + input area) ─────────────────────────── */

interface ChatPanelProps {
  pdfFileName: string;
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatPanel({ pdfFileName, messages, isLoading }: ChatPanelProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <IconFileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center max-w-md">
              <p className="text-sm font-medium text-foreground">Ready to chat</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ask anything about <span className="font-medium text-foreground">{pdfFileName}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full py-6 px-4 space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur-md p-4">
        <div className="max-w-3xl mx-auto w-full">
          <PromptBox />
        </div>
      </div>
    </div>
  );
}