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
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
