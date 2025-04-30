// Banner.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/app/(public)/_components/(section-1)/_crud-actions/_store/use-slide-store";
import { UserRole } from "@/app/SessionProvider";
import { Slide } from "@/app/(public)/_components/(section-1)/types";
import { deleteSlide } from "@/app/(public)/_components/(section-1)/_crud-actions/delete-actions";
import EditBannerModal from "./EditBannerModal";


interface BannerProps {
  userRole?: UserRole;
  initialBanner?: Slide;
}

const Banner: React.FC<BannerProps> = ({ userRole, initialBanner }) => {
  const { banner, setBanner, deleteBanner } = useSlideStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSlide(initialBanner?.id || "");
      toast.success("Banner deleted successfully");
      setBanner(undefined);
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUploadSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-[100px] overflow-hidden bg-gray-100">
      {initialBanner && (
        <div className="relative h-full">
          <Image
            src={initialBanner.sliderImageurl}
            alt={initialBanner.title}
            fill
            priority
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <button onClick={handleEdit} disabled={isDeleting}>
              <Pencil className="w-6 h-6 text-white hover:text-gray-300" />
              <span className="hidden lg:block">Edit</span>
            </button>
            <button onClick={handleDelete} className="text-white bg-red-500 hover:bg-red-600 rounded-full p-2" disabled={isDeleting}>
              {isDeleting ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <Trash className="w-6 h-6" />
              )}
              <span className="hidden lg:block">Delete</span>
            </button>
          </div>
        </div>
      )}
      {!initialBanner && userRole === "EDITOR" && (
        <button onClick={handleEdit} className="w-full h-full flex items-center justify-center text-white bg-gray-300 rounded-lg">
          <Pencil className="w-6 h-6 text-white hover:text-gray-300" />
          <span className="hidden lg:block">Upload Banner</span>
        </button>
      )}
      <EditBannerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleUploadSuccess}
        initialBanner={initialBanner}
      />
    </div>
  );
};

export default Banner;