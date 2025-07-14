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
  category?: string;
  sortBy?: 'price' | 'rating';
  order?: 'asc' | 'desc';
} = {}) {
  let url = `${API_BASE_URL}/products?skip=${pageParam}&limit=${limit}`;
  if (category) {
    url = `${API_BASE_URL}/products/category/${category}?skip=${pageParam}&limit=${limit}`;
  }
  const params: string[] = [];
  if (sortBy) params.push(`sortBy=${sortBy}`);
  if (order) params.push(`order=${order}`);
  if (params.length) {
    url += (url.includes('?') ? '&' : '?') + params.join('&');
  }
  const response = await axios.get<ProductApiResponse>(url);
  return response.data;
}
