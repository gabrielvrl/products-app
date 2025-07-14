import axios from 'axios';

export interface Category {
  slug: string;
  name: string;
  url: string;
}

const API_BASE_URL = 'https://dummyjson.com';

export async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get<Category[]>(
    `${API_BASE_URL}/products/categories`,
  );
  return response.data;
}
