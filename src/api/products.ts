import type { Product } from '../types/product.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://fakestoreapi.com';

export const productQueryKeys = {
  all:        ['products'] as const,
  lists:      () => [...productQueryKeys.all, 'list'] as const,
  categories: () => [...productQueryKeys.all, 'categories'] as const,
  detail:     (id: number) => [...productQueryKeys.all, 'detail', id] as const,
};

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Failed to fetch products by category');
    return response.json();
  },
};
