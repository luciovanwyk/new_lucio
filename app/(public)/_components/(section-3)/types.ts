export interface BaseProductProps {
  id: string;
  name: string;
  rating: number;
  image: string;
}

export interface RegularProductProps extends BaseProductProps {
  price: string;
  originalPrice?: never;
  salePrice?: never;
}

export interface SaleProductProps extends BaseProductProps {
  originalPrice: string;
  salePrice: string;
  price?: never;
}

export type ProductCardProps = RegularProductProps | SaleProductProps;

export type ExtendedProductCardProps = ProductCardProps & {
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (product: ProductCardProps) => void;
};

export interface EmptySlotProps {
  isEmpty: true;
  id?: never;
  name?: never;
  price?: never;
  salePrice?: never;
  originalPrice?: never;
  onAdd?: () => void;
}

export interface EditModalProps {
  product: ProductCardProps;
  onSave: (updatedProduct: ProductCardProps) => void;
  onClose: () => void;
}

export interface ProductSlideProps {
  products: (ProductCardProps | EmptySlotProps)[];
  isMobile: boolean;
  activeTab: number;
  tabName: string;
}

export type TabContent = {
  [key: number]: (ProductCardProps | EmptySlotProps)[][];
};
