import axios from 'axios';
import { ProductApiResponse } from '../types/Product';

const API_BASE_URL = 'https://dummyjson.com';

export async function fetchProducts({
  pageParam = 0,
  limit = 20,
  category,
  sortBy,
  order,
}: {
  pageParam?: number;
  limit?: number;
  category?: string | null;
  sortBy?: 'price' | 'rating' | null;
  order?: 'asc' | 'desc' | null;
} = {}) {
  const basePath = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products';

  const url = new URL(basePath, API_BASE_URL);
  url.searchParams.set('skip', String(pageParam));
  url.searchParams.set('limit', String(limit));
  if (sortBy) url.searchParams.set('sortBy', sortBy);
  if (order) url.searchParams.set('order', order);

  const response = await axios.get<ProductApiResponse>(url.toString());
  return response.data;
}
