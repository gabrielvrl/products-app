import { Product } from '../types/Product';

export interface ProductListItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export function mapProductToListItem(product: Product): ProductListItem {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
  };
}

export function mapProductsToListItems(products: Product[]): ProductListItem[] {
  return products.map(mapProductToListItem);
}
