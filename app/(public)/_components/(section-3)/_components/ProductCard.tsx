// app/(public)/_components/(section-3)/_components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import { Package, Star, Pencil, Trash2 } from "lucide-react";
import {
  ProductCardProps as ImportedProductCardProps,
  BaseProductProps,
  RegularProductProps,
  SaleProductProps,
} from "../types";
import { cn } from "@/lib/utils";

type ProductCardComponentProps = ImportedProductCardProps & {
  userRole?: string;
  onEdit?: (item: ImportedProductCardProps) => void;
  onDelete?: (item: ImportedProductCardProps) => void;
};

const ProductCard: React.FC<ProductCardComponentProps> = (props) => {
  const { id, name, rating, image, userRole, onEdit, onDelete } = props;
  const isEditor = userRole === "EDITOR";

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(props);
    } else {
      console.warn("onEdit handler not provided to ProductCard for item:", id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(props);
    } else {
      console.warn(
        "onDelete handler not provided to ProductCard for item:",
        id,
      );
    }
  };

  const renderPrice = () => {
    if ("price" in props && typeof props.price === "string") {
      return (
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          R{props.price}
        </span>
      );
    } else if (
      "salePrice" in props &&
      typeof props.salePrice === "string" &&
      "originalPrice" in props &&
      typeof props.originalPrice === "string"
    ) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-red-500 dark:text-red-400">
            R{props.salePrice}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
            R{props.originalPrice}
          </span>
        </div>
      );
    }
    return <span className="text-lg font-semibold text-gray-900 dark:text-white">--</span>;
  };

  const renderStars = () => {
    const starCount = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < starCount
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            )}
            strokeWidth={i < starCount ? 0 : 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg transition-all duration-300
        bg-white/80 dark:bg-burgundy-dark/40 backdrop-blur-sm
        hover:shadow-xl hover:scale-[1.02] cursor-pointer
        border border-gray-100 dark:border-white/10"
    >
      <div className="relative aspect-square overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-burgundy-light/20">
            <Package className="h-12 w-12 text-gray-400 dark:text-white/50" />
          </div>
        )}
        {isEditor && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleEditClick}
              className="rounded-full bg-white/90 dark:bg-burgundy-light/90 p-2 text-gray-600 dark:text-white
                hover:bg-burgundy-light/90 dark:hover:bg-burgundy-dark/90 hover:text-white transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="rounded-full bg-white/90 dark:bg-burgundy-light/90 p-2 text-gray-600 dark:text-white
                hover:bg-red-500/90 hover:text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1 p-4 dark:text-white">
        <h3 className="font-semibold line-clamp-1 text-gray-900 dark:text-white
          group-hover:text-burgundy-light dark:group-hover:text-white transition-colors">
          {name}
        </h3>
        {renderStars()}
        <div className="dark:text-white/90">
          {renderPrice()}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;