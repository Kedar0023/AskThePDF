import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface FileUpload01Props {
	onFileUploaded?: (file: File) => void;
}

export default function FileUpload01({ onFileUploaded }: FileUpload01Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [fileProgress, setFileProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState(false);

	const handleFileSelect = (files: FileList | null) => {
		if (!files || files.length === 0) return;

		const file = files[0];
		if (file.type !== "application/pdf") return;

		setUploadedFile(file);
		setIsUploading(true);

		// Simulate upload progress
		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 10;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				setIsUploading(false);
			}
			setFileProgress(Math.min(progress, 100));
		}, 300);
	};

	const handleBoxClick = () => {
		fileInputRef.current?.click();
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		handleFileSelect(e.dataTransfer.files);
	};

	const removeFile = () => {
		setUploadedFile(null);
		setFileProgress(0);
		setIsUploading(false);
		// Reset the input so the same file can be re-selected
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleContinue = () => {
		if (uploadedFile && !isUploading && onFileUploaded) {
			onFileUploaded(uploadedFile);
		}
	};

	const handleCancel = () => {
		removeFile();
	};

	return (
		<div className="flex items-center justify-center w-full">
			<Card className="w-full mx-auto max-w-lg bg-background rounded-lg p-0 shadow-md">
				<CardContent className="p-0">
					<div className="px-6 py-6">
						<div
							className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
							onClick={handleBoxClick}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							<div className="mb-2 bg-muted rounded-full p-3">
								<Upload className="h-5 w-5 text-muted-foreground" />
							</div>
							<p className="text-pretty text-sm font-medium text-foreground">Upload a PDF</p>
							<p className="text-pretty text-sm text-muted-foreground mt-1">
								or,{" "}
								<label
									htmlFor="fileUpload"
									className="text-primary hover:text-primary/90 font-medium cursor-pointer"
									onClick={(e) => e.stopPropagation()}
								>
									click to browse
								</label>{" "}
								(20MB max)
							</p>
							<input
								type="file"
								id="fileUpload"
								ref={fileInputRef}
								className="hidden"
								accept=".pdf"
								onChange={(e) => handleFileSelect(e.target.files)}
							/>
						</div>
					</div>

					<div className={cn("px-6 pb-5 space-y-3", uploadedFile ? "mt-4" : "")}>
						{uploadedFile && (
							<div className="border border-border rounded-lg p-2 flex flex-col">
								<div className="flex items-center gap-2">
									<div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
										<FileText className="h-7 w-7 text-red-500" />
									</div>

									<div className="flex-1 pr-1">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												<span className="text-sm text-foreground truncate max-w-[250px]">{uploadedFile.name}</span>
												<span className="text-sm text-muted-foreground whitespace-nowrap">
													{Math.round(uploadedFile.size / 1024)} KB
												</span>
											</div>
											<Button
												variant="ghost"
												size="icon-sm"
												className="bg-transparent! hover:text-red-500"
												onClick={removeFile}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>

										<div className="flex items-center gap-2">
											<div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
												<div
													className="h-full bg-primary"
													style={{
														width: `${fileProgress}%`,
													}}
												></div>
											</div>
											<span className="text-xs text-muted-foreground whitespace-nowrap">
												{Math.round(fileProgress)}%
											</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="px-6 py-3 border-t border-border bg-muted rounded-b-lg flex justify-end">
						<div className="flex gap-2">
							<Button variant="outline" className="h-9 px-4 text-sm font-medium" onClick={handleCancel}>
								Cancel
							</Button>
							<Button
								className="h-9 px-4 text-sm font-medium"
								disabled={!uploadedFile || isUploading}
								onClick={handleContinue}
							>
								Continue
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
