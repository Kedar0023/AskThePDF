"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUpload01 from "@/components/file-upload-01";
import Ai02 from "@/components/ai-02";
import {
  IconFileText,
  IconEye,
  IconEyeOff,
  IconUpload,
  IconX,
  IconFileTypePdf,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { useState, useCallback, useMemo } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatWithPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfScale, setPdfScale] = useState(1);

  const handleFileUploaded = useCallback((file: File) => {
    setPdfFile(file);
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setShowUploadModal(false);
    setShowPreview(true);
  }, []);

  const handleRemovePdf = useCallback(() => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfFile(null);
    setPdfUrl(null);
    setMessages([]);
  }, [pdfUrl]);

  const handleZoomIn = () => setPdfScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setPdfScale((s) => Math.max(s - 0.25, 0.5));

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <IconFileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">
              Ask the PDF
            </h1>
            {pdfFile && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {pdfFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pdfFile && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs hidden sm:inline-flex"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <IconEyeOff className="h-3.5 w-3.5" />
                ) : (
                  <IconEye className="h-3.5 w-3.5" />
                )}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="sm:hidden"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <IconEyeOff className="h-3.5 w-3.5" />
                ) : (
                  <IconEye className="h-3.5 w-3.5" />
                )}
              </Button>
            </>
          )}
          {pdfFile && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleRemovePdf}
              title="Remove PDF"
            >
              <IconX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Preview Panel */}
        {pdfFile && showPreview && (
          <div
            className={cn(
              "flex flex-col border-r border-border bg-muted/30 transition-all duration-300 ease-in-out shrink-0",
              // On mobile it takes full width as an overlay, on desktop it's a side panel
              "fixed inset-0 top-[53px] z-10 bg-background sm:static sm:z-auto",
              "w-full sm:w-[420px] lg:w-[500px] xl:w-[560px]"
            )}
          >
            {/* PDF Panel Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/50 shrink-0">
              <div className="flex items-center gap-2">
                <IconFileTypePdf className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
                  {pdfFile.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleZoomOut}
                  title="Zoom out"
                >
                  <IconZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground min-w-[40px] text-center">
                  {Math.round(pdfScale * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleZoomIn}
                  title="Zoom in"
                >
                  <IconZoomIn className="h-3.5 w-3.5" />
                </Button>
                {/* Close button on mobile */}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="sm:hidden ml-1"
                  onClick={() => setShowPreview(false)}
                >
                  <IconX className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto p-4">
              {pdfUrl && (
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full rounded-lg border border-border bg-white"
                  style={{
                    transform: `scale(${pdfScale})`,
                    transformOrigin: "top left",
                    width: `${100 / pdfScale}%`,
                    height: `${100 / pdfScale}%`,
                  }}
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {!pdfFile ? (
            /* Upload State */
            <div className="flex flex-1 items-center justify-center p-4">
              <div className="w-full max-w-lg flex flex-col items-center gap-6">
                {/* Hero area */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                    <IconFileTypePdf className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Chat with your PDF
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Upload a PDF document to start asking questions.
                    Get instant, AI-powered answers from your files.
                  </p>
                </div>

                {/* Upload Component */}
                <UploadWrapper onFileUploaded={handleFileUploaded} />
              </div>
            </div>
          ) : (
            /* Chat State */
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      <IconFileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center max-w-md">
                      <p className="text-sm font-medium text-foreground">
                        Ready to chat
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ask anything about{" "}
                        <span className="font-medium text-foreground">
                          {pdfFile.name}
                        </span>
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
                  <Ai02 />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload modal overlay */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute -top-2 -right-2 z-10 bg-background border border-border rounded-full"
              onClick={() => setShowUploadModal(false)}
            >
              <IconX className="h-4 w-4" />
            </Button>
            <UploadWrapper onFileUploaded={handleFileUploaded} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────── */

function UploadWrapper({
  onFileUploaded,
}: {
  onFileUploaded: (file: File) => void;
}) {
  const fileInputRef = useState<HTMLInputElement | null>(null);

  return (
    <div className="w-full max-w-lg">
      <Card className="bg-card border-border shadow-lg rounded-xl overflow-hidden p-0">
        <div className="px-6 py-6">
          <UploadZone onFileUploaded={onFileUploaded} />
        </div>
      </Card>
    </div>
  );
}

function UploadZone({
  onFileUploaded,
}: {
  onFileUploaded: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type === "application/pdf") {
      onFileUploaded(file);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf";
        input.onchange = (e) =>
          handleFileSelect((e.target as HTMLInputElement).files);
        input.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
      }}
    >
      <div className="mb-3 bg-muted rounded-full p-3.5">
        <IconUpload className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Drop your PDF here
      </p>
      <p className="text-xs text-muted-foreground mt-1.5">
        or{" "}
        <span className="text-primary font-medium">click to browse</span>{" "}
        (20 MB max)
      </p>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
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
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex items-start">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
          <IconFileText className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      </div>
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
