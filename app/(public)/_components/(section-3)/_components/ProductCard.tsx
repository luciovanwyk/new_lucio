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
    if ("price" in props && typeof props.price === "string") 
      {
      return (
        <span className="text-lg font-semibold text-primary">
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
          <span className="text-lg font-semibold text-red-600">
            R{props.salePrice}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            R{props.originalPrice}
          </span>
        </div>
      );
    }
    return <span className="text-lg font-semibold text-primary">--</span>; 
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
                : "text-gray-300 dark:text-gray-600",
            )}
            strokeWidth={i < starCount ? 0 : 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full sm:flex-1 p-4 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow duration-200 relative group flex flex-col">
      {" "}

      {isEditor && (
        <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleEditClick}
            className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/70 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Edit ${name}`}
            title={`Edit ${name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800/70 transition shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={`Delete ${name}`}
            title={`Delete ${name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div className="relative flex-shrink-0 flex justify-center items-center h-48 bg-secondary dark:bg-secondary/50 rounded-md mb-4 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name ?? "Product image"} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
            className="object-contain p-1" 
            priority={false}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <Package className="w-16 h-16 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-sm md:text-base text-foreground font-medium mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
          {name}
        </h3>
        <div className="flex justify-between items-center mt-auto pt-2">
          {renderPrice()}
          {renderStars()}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;