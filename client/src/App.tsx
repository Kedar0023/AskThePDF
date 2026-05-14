import FileUpload01 from "@/components/file-upload-01";
import { IconFileText, IconFileTypePdf } from "@tabler/icons-react";
import PDFViewer, { usePdfUpload, PDFHeaderControls, UploadModal } from "./components/pdf-viewer";
import ChatPanel, { useChatMessages } from "./components/chatMessages";
import { ModeToggle } from "./components/theme-provider";

export default function App() {
  const {
    pdfFile,
    pdfUrl,
    showPreview,
    setShowPreview,
    showUploadModal,
    setShowUploadModal,
    handleFileUploaded,
    handleRemovePdf: rawRemovePdf,
    togglePreview,
  } = usePdfUpload();

  const { messages, isLoading, clearMessages } = useChatMessages();

  // Wrap handleRemovePdf to also clear messages
  const handleRemovePdf = () => {
    rawRemovePdf();
    clearMessages();
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <IconFileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-foreground leading-tight">Ask the PDF</h1>
            {pdfFile && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">{pdfFile.name}</p>
            )}
            <ModeToggle/>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pdfFile && (
            <PDFHeaderControls
              pdfFile={pdfFile}
              showPreview={showPreview}
              togglePreview={togglePreview}
              handleRemovePdf={handleRemovePdf}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Preview Panel */}
        {pdfFile && showPreview && pdfUrl && (
          <PDFViewer pdfFile={pdfFile} pdfUrl={pdfUrl} setShowPreview={setShowPreview} />
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
                  <h2 className="text-xl font-semibold text-foreground">Chat with your PDF</h2>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Upload a PDF document to start asking questions. Get instant, AI-powered answers from your files.
                  </p>
                </div>

                {/* Upload Component */}
                <FileUpload01 onFileUploaded={handleFileUploaded} />
              </div>
            </div>
          ) : (
            <ChatPanel pdfFileName={pdfFile.name} messages={messages} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* Upload modal overlay */}
      {showUploadModal && <UploadModal onFileUploaded={handleFileUploaded} onClose={() => setShowUploadModal(false)} />}
    </div>
  );
}