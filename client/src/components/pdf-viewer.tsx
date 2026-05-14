import { cn } from "@/lib/utils";
import { IconFileTypePdf, IconX, IconZoomIn, IconZoomOut, IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "./ui/button";
import FileUpload01 from "./file-upload-01";
import { useState, useCallback } from "react";

/**
 * Hook that encapsulates all file-upload / PDF state and handlers.
 * Used by App.tsx to keep upload logic out of the root component.
 */
export function usePdfUpload() {
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [showPreview, setShowPreview] = useState(true);
	const [showUploadModal, setShowUploadModal] = useState(false);

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
	}, [pdfUrl]);

	const togglePreview = useCallback(() => {
		setShowPreview((prev) => !prev);
	}, []);

	return {
		pdfFile,
		pdfUrl,
		showPreview,
		setShowPreview,
		showUploadModal,
		setShowUploadModal,
		handleFileUploaded,
		handleRemovePdf,
		togglePreview,
	};
}

/* ─── Header controls (preview toggle + remove) ────────────────── */

interface PDFHeaderControlsProps {
	pdfFile: File;
	showPreview: boolean;
	togglePreview: () => void;
	handleRemovePdf: () => void;
}

export function PDFHeaderControls({ showPreview, togglePreview, handleRemovePdf }: PDFHeaderControlsProps) {
	return (
		<>
			<Button variant="outline" size="sm" className="gap-1.5 text-xs hidden sm:inline-flex" onClick={togglePreview}>
				{showPreview ? <IconEyeOff className="h-3.5 w-3.5" /> : <IconEye className="h-3.5 w-3.5" />}
				{showPreview ? "Hide Preview" : "Show Preview"}
			</Button>
			<Button variant="outline" size="icon-sm" className="sm:hidden" onClick={togglePreview}>
				{showPreview ? <IconEyeOff className="h-3.5 w-3.5" /> : <IconEye className="h-3.5 w-3.5" />}
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				className="text-muted-foreground hover:text-destructive"
				onClick={handleRemovePdf}
				title="Remove PDF"
			>
				<IconX className="h-4 w-4" />
			</Button>
		</>
	);
}

/* ─── Upload modal overlay ──────────────────────────────────────── */

interface UploadModalProps {
	onFileUploaded: (file: File) => void;
	onClose: () => void;
}

export function UploadModal({ onFileUploaded, onClose }: UploadModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="relative">
				<Button
					variant="ghost"
					size="icon-sm"
					className="absolute -top-2 -right-2 z-10 bg-background border border-border rounded-full"
					onClick={onClose}
				>
					<IconX className="h-4 w-4" />
				</Button>
				<FileUpload01 onFileUploaded={onFileUploaded} />
			</div>
		</div>
	);
}

/* ─── PDF Viewer panel ──────────────────────────────────────────── */

interface PDFViewerProps {
	pdfFile: File;
	pdfUrl: string;
	setShowPreview: (show: boolean) => void;
}

const PDFViewer = ({ pdfFile, pdfUrl, setShowPreview }: PDFViewerProps) => {
	const [pdfScale, setPdfScale] = useState(1);

	const handleZoomIn = () => setPdfScale((s) => Math.min(s + 0.25, 3));
	const handleZoomOut = () => setPdfScale((s) => Math.max(s - 0.25, 0.5));

	return (
		<div
			className={cn(
				"flex flex-col border-r border-border bg-muted/30 transition-all duration-300 ease-in-out shrink-0",
				// On mobile it takes full width as an overlay, on desktop it's a side panel
				"fixed inset-0 top-[53px] z-10 bg-background sm:static sm:z-auto",
				"w-full sm:w-[420px] lg:w-[500px] xl:w-[560px]",
			)}
		>
			{/* PDF Panel Header */}
			<div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/50 shrink-0">
				<div className="flex items-center gap-2">
					<IconFileTypePdf className="h-4 w-4 text-red-500" />
					<span className="text-xs font-medium text-foreground truncate max-w-[180px]">{pdfFile.name}</span>
				</div>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon-sm" onClick={handleZoomOut} title="Zoom out">
						<IconZoomOut className="h-3.5 w-3.5" />
					</Button>
					<span className="text-xs text-muted-foreground min-w-[40px] text-center">{Math.round(pdfScale * 100)}%</span>
					<Button variant="ghost" size="icon-sm" title="Zoom in" onClick={handleZoomIn}>
						<IconZoomIn className="h-3.5 w-3.5" />
					</Button>
					{/* Close button on mobile */}
					<Button variant="ghost" size="icon-sm" className="sm:hidden ml-1" onClick={() => setShowPreview(false)}>
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
	);
};

export default PDFViewer;
