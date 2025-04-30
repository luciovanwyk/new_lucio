"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "../../SessionProvider";
import { deleteCollectionBanner } from "./_actions/utils";
import BannerEditModal from "./BannerSlot";

interface EditableCollectionBannerProps {
  initialBannerUrl: string | null | undefined;
  category: string;
  categoryName: string;
  isLoading: boolean;
}

export default function EditableCollectionBanner({
  initialBannerUrl,
  category,
  categoryName,
  isLoading: isLoadingInitialData,
}: EditableCollectionBannerProps) {
  const { user } = useSession();
  const [currentBannerUrl, setCurrentBannerUrl] = useState(initialBannerUrl);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCurrentBannerUrl(initialBannerUrl);
  }, [initialBannerUrl]);

  const isEditor = user?.role === "EDITOR";

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (newImageUrl: string) => {
    setCurrentBannerUrl(newImageUrl);
    setIsEditModalOpen(false);
  };

  const handleOpenDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCollectionBanner(category);
    if (result.success) {
      toast.success(result.message || "Banner deleted!");
      setCurrentBannerUrl(null);
      setIsDeleteModalOpen(false);
    } else {
      if (result.error?.includes("Unauthorized")) {
        toast.error("Unauthorized.");
      } else {
        toast.error(result.error || "Failed to delete banner.");
      }
    }
    setIsDeleting(false);
  };

  if (isLoadingInitialData) {
    return <Skeleton className="w-full aspect-[4/1] mb-6 md:mb-8 rounded-md" />;
  }

  if (!currentBannerUrl && !isEditor) {
    return null;
  }

  return (
    <div className="w-full mb-6 md:mb-8 relative group">
      <div className="relative w-full aspect-[4/1] overflow-hidden rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700">
        {currentBannerUrl ? (
          <Image
            src={currentBannerUrl}
            alt={`${categoryName} Collection Banner`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            key={currentBannerUrl}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {isEditor ? "No Banner Set" : ""}
          </div>
        )}

        {isEditor && (
          <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleOpenEdit}
              className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/70 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Edit ${categoryName} Banner`}
              title={`Edit ${categoryName} Banner`}
            >
              <Edit3 size={14} />
            </button>

            {currentBannerUrl && (
              <button
                onClick={handleOpenDelete}
                className="p-1.5 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800/70 transition shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Delete ${categoryName} Banner`}
                title={`Delete ${categoryName} Banner`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <BannerEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={category}
        categoryName={categoryName}
        currentImageUrl={currentBannerUrl}
        onSuccess={handleEditSuccess}
      />

      {isEditor && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center ${
            isDeleteModalOpen ? "" : "hidden"
          }`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">Are you absolutely sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This will permanently delete the banner for the &quot;
              {categoryName}&quot; collection. This action can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}