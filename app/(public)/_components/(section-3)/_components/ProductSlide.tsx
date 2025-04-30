// ProductSlide.tsx
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { UploadModal } from './(new-arrivals)/UploadModal';
import { BestSellerUploadModal } from './(best-seller)/BestSellerUploadModal';
import { EmptySlotCard } from './EmptySlotCard';
import { ProductSlideProps } from '../types';
import useBestSellerStore from '../_store/(best-store)/best-seller-store';


export const ProductSlide: React.FC<ProductSlideProps> = ({
  products,
  isMobile,
  activeTab,
  tabName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { deleteBestSeller, bestSellers } = useBestSellerStore(); // Access bestSellers from the store

  const handleEdit = (product: any) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    deleteBestSeller(productId);
    setIsModalOpen(false);
  };

  const renderModal = () => {
    let modalComponent = null;

    if (isEditing) {
      modalComponent = (
        <BestSellerUploadModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentProduct(null); // Reset current product when modal closes
          }}
          product={currentProduct}
          isEditing={isEditing}
          onSave={handleSave}
        />
      );
    } else {
      modalComponent = (
        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      );
    }

    return modalComponent;
  };

  const handleSave = async (updatedProduct: any) => {
    // Update the store with the new product data
    useBestSellerStore.setState({
      bestSellers: bestSellers.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    });
    setIsModalOpen(false);
    setCurrentProduct(null); // Reset current product after save
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4">
        {products.map((product, idx) =>
          "isEmpty" in product ? (
            <EmptySlotCard
              key={`empty-${idx}`}
              onAdd={() => setIsModalOpen(true)}
              tabName={tabName}
            />
          ) : (
            <ProductCard
              key={`product-${idx}`}
              {...product}
              showActions
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
            />
          ),
        )}
      </div>

      {renderModal()}
    </>
  );
};