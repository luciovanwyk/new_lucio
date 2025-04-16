"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSession } from "../../SessionProvider";
import { uploadBackground } from "./_profile-actions/background-upload";

interface BackgroundUploadFormProps {
  backgroundUrl: string | null;
  onSuccess: (newBackgroundUrl: string) => void;
  onClose: () => void;
}

export default function BackgroundUploadForm({ backgroundUrl, onSuccess, onClose }: BackgroundUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(backgroundUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateBackground } = useSession();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedFile(file);

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    return () => {
      if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    };
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("background", selectedFile);

      const result = await uploadBackground(formData);

      if (!result.success || !result.backgroundUrl) {
        throw new Error(result.error || "Failed to upload background");
      }

      onSuccess(result.backgroundUrl);
      updateBackground(result.backgroundUrl);
      toast.success("Background updated successfully");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Background Image</h2>

      <div className="mb-6 mx-auto w-full h-48 relative rounded-lg overflow-hidden border-4 border-teal-500">
        {previewUrl ? (
          <Image src={previewUrl} alt="Background Preview" fill className="object-cover rounded-lg" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-slate-600 rounded-lg border-4 border-teal-500">
            No background image
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id="background-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        aria-label="Upload background image"
        title="Choose a background image to upload"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-3 px-3 bg-teal-500 text-white rounded text-center font-medium hover:bg-teal-400 transition cursor-pointer mb-4"
      >
        Upload New Background
      </button>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="w-1/2 py-3 px-3 bg-slate-200 rounded text-slate-800 text-center font-medium hover:bg-slate-300 transition"
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-1/2 py-3 px-3 bg-teal-500 rounded text-white text-center font-medium hover:bg-teal-400 transition disabled:bg-teal-300 disabled:cursor-not-allowed"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Save"}
        </button>
      </div>
    </div>
  );
}
