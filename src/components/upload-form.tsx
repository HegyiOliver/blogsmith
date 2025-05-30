"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Added cn import

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setFile(null);
        toast.error("Invalid file type. Please upload a .docx or .pdf file.");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      }
    } else {
      setFile(null); // Reset if no file is selected (e.g., user cancels file dialog)
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "File upload failed.");
      }

      toast.success(`File "${result.fileName}" uploaded successfully. Processing started.`);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file-upload-button">Select Document</Label>
        <Input
          id="file-upload" // Keep id for potential label association if needed elsewhere, though button triggers it
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden" // Hide the actual file input
        />
        <Button
          id="file-upload-button"
          type="button" // Important: not a submit button
          variant="outline" // Use outline variant for a distinct look from the submit button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="w-full"
        >
          Choose Document
        </Button>
        {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
      </div>
      <Button
        type="submit"
        disabled={isUploading || !file}
        className={cn(
          "w-full",
          isUploading && "flaming-button" // Apply flaming effect when uploading
        )}
      >
        {isUploading ? "Uploading..." : "Upload and Generate Blog Post"}
      </Button>
    </form>
  );
}
