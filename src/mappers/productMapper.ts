import { Product } from '../types/Product';

export interface ProductListItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
}

export function mapProductToListItem(product: Product): ProductListItem {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    rating: typeof product.rating === 'number' ? product.rating : 0,
  };
}

export function mapProductsToListItems(products: Product[]): ProductListItem[] {
  return products.map(mapProductToListItem);
}
