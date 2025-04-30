// app/(public)/(group-products)/layout.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import FilterSidebar from "./_components/(filterside)/FilterSidebar";
import { useProductStore } from "./_components/_store/product-store";
import { Slide } from "@/app/(public)/_components/(section-1)/types";
import { UserRole } from "@prisma/client";
import Banner from "./_components/(banners)/BannerSlot";

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const hasInitialized = useRef(false);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!hasInitialized.current) {
      fetchProducts();
      hasInitialized.current = true;
    }
  }, [fetchProducts]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-28">
      <Banner userRole={"EDITOR"} initialBannerUrl={bannerUrl} />
      <div className="flex gap-x-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28">
            <FilterSidebar />
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <div className="lg:hidden">
        <FilterSidebar />
      </div>
    </div>
  );
}