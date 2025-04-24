import React from "react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: { name: string }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Add Product</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            onAddProduct({ name: "Example Product" });
          }}
        >
          Add Example Product
        </button>
        <button className="ml-2 text-gray-600" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddProductModal;
