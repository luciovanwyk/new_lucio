// app/(public)/_components/(section-3)/_components/DeleteConfirmationModal.tsx
"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}) => {
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="mb-4">
          <h3 className="text-lg font-bold">Are you absolutely sure?</h3>
          <p className="text-sm text-gray-600">
            This action cannot be undone. This will permanently delete the item
            <strong className="px-1">{itemName}</strong>
            and remove its data and associated image from the servers.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : <><Trash2 className="mr-2 h-4 w-4" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;