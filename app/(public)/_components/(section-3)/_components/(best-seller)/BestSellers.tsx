import { useMemo, useEffect, useState } from "react";
import { ProductCardProps, TabContent } from "../../types";
import { useSession } from "@/app/SessionProvider";
import useBestSellerStore from "../../_store/(best-store)/best-seller-store";
import ProductCard from "../ProductCard";

const SLOTS_PER_PAGE = {
  mobile: 2,
  desktop: 4,
};

export const useBestSellersContent = (): TabContent => {
  const { bestSellers, fetchBestSellers, deleteBestSeller } = useBestSellerStore();
  const { user } = useSession();
  const isEditor = user?.role === "EDITOR";

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  return useMemo(() => {
    const convertedProducts: ProductCardProps[] = bestSellers.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      rating: item.rating,
      image: item.imageUrl,
    }));

    const mobilePages: ProductCardProps[][] = [];
    const desktopPages: ProductCardProps[][] = [];
    for (let i = 0; i < convertedProducts.length; i += SLOTS_PER_PAGE.mobile) {
      mobilePages.push(convertedProducts.slice(i, i + SLOTS_PER_PAGE.mobile));
    }

    for (let i = 0; i < convertedProducts.length; i += SLOTS_PER_PAGE.desktop) {
      desktopPages.push(convertedProducts.slice(i, i + SLOTS_PER_PAGE.desktop));
    }

    const addEmptySlots = (
      pages: ProductCardProps[][],
      slotsPerPage: number,
    ): ProductCardProps[][] => {
      if (!isEditor) {
        return pages.length > 0 ? pages : [[]];
      }

      if (pages.length === 0) {
        return [Array(slotsPerPage).fill({ isEmpty: true })];
      }

      const lastPage = pages[pages.length - 1];
      const remainingSlots = slotsPerPage - (lastPage.length % slotsPerPage);

      if (remainingSlots < slotsPerPage) {
        lastPage.push(...Array(remainingSlots).fill({ isEmpty: true }));
      }

      return pages;
    };

    const content: TabContent = {
      mobile: addEmptySlots([...mobilePages], SLOTS_PER_PAGE.mobile),
      desktop: addEmptySlots([...desktopPages], SLOTS_PER_PAGE.desktop),
    };

    return content;
  }, [bestSellers, isEditor]);
};

const BestSellers = () => {
  const content = useBestSellersContent();
  const { deleteBestSeller } = useBestSellerStore();

  const handleDelete = (id: string) => {
    deleteBestSeller(id);
  };

  return (
    <div>
      {content.mobile.map((page, pageIndex) => (
        <div key={pageIndex} className="flex flex-wrap">
          {page.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              showActions={true}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { BestSellers };
export const BestSellersContent = {};