// ProductCard.tsx
import React from "react";
import Image from "next/image";
import { Package, Star, Pencil, Trash2 } from "lucide-react";
import { ExtendedProductCardProps } from "../types";

const ProductCard = ({
  id,
  name,
  rating,
  image,
  showActions = false,
  onEdit,
  onDelete,
  ...priceProps
}: ExtendedProductCardProps) => {
  const renderPrice = () => {
    if ("price" in priceProps) {
      return (
        <span className="text-lg font-semibold text-primary">
          R{priceProps.price}
        </span>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-red-600">
            R{priceProps.salePrice}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            R{priceProps.originalPrice}
          </span>
        </div>
      );
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete?.();
    }
  };

  return (
    <div className="w-full sm:flex-1 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow relative">
      {showActions && (onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Edit product"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 bg-white/90 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      )}

      <div className="relative flex justify-center items-center h-48 bg-secondary rounded-md mb-4">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover rounded-md"
            priority
          />
        ) : (
          <Package className="w-16 h-16 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-card-foreground font-medium mb-2 line-clamp-1">
        {name}
      </h3>

      <div className="flex justify-between items-center mb-2">
        {renderPrice()}
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;