import axios from 'axios';
import { Product } from '../types/Product';

const API_BASE_URL = 'https://dummyjson.com';

export async function fetchProductDetail(productId: number): Promise<Product> {
  const response = await axios.get<Product>(
    `${API_BASE_URL}/products/${productId}`,
  );
  return response.data;
}
