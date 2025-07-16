import axios from 'axios';
import { Category } from 'types/Product';

const API_BASE_URL = 'https://dummyjson.com';

export async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get<Category[]>(
    `${API_BASE_URL}/products/categories`,
  );
  return response.data;
}
