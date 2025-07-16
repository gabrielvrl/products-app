export type SortField = 'price' | 'rating' | null;
export type SortOrder = 'asc' | 'desc' | null;

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  brand: string;
  stock: number;
  rating: number;
  category: string;
  discountPercentage?: number;
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
  images?: string[];
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductListItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
}
