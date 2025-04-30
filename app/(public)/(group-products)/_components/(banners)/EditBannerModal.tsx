// EditBannerModal.tsx
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/app/(public)/_components/(section-1)/_crud-actions/_store/use-slide-store";
import { Slide } from "@/app/(public)/_components/(section-1)/types";

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialBanner?: Slide;
}

const EditBannerModal: React.FC<EditBannerModalProps> = ({ isOpen, onClose, onSuccess, initialBanner }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setBanner } = useSlideStore();

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload-slide", { // Adjust the URL to your server endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload slide");
      }

      const newBanner = await response.json();
      setBanner(newBanner);
      onSuccess();
      toast.success("Banner updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update banner");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    isOpen && (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Please upload a new banner image.</DialogDescription>
          </DialogHeader>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0])} disabled={isUploading} />
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogContent>
      </Dialog>
    )
  );
};

export default EditBannerModal;