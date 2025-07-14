import axios from 'axios';
import { ProductApiResponse } from '../types/Product';

const API_BASE_URL = 'https://dummyjson.com';

export async function fetchProducts({
  pageParam = 0,
  limit = 20,
  category,
}: { pageParam?: number; limit?: number; category?: string } = {}) {
  let url = `${API_BASE_URL}/products?skip=${pageParam}&limit=${limit}`;
  if (category) {
    url = `${API_BASE_URL}/products/category/${category}?skip=${pageParam}&limit=${limit}`;
  }
  const response = await axios.get<ProductApiResponse>(url);
  return response.data;
}
