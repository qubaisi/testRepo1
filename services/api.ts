
import { Product, User, Order, Category, Type } from '../types';

const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your Spring Boot server URL

export const api = {
  // Auth
  login: async (email: string, pass: string): Promise<User> => {
    // In a real Spring Boot app, this would return a JWT
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (name: string, email: string, pass: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  // Marketplace
  getProducts: async (category?: string): Promise<Product[]> => {
    const url = category && category !== 'All' 
      ? `${API_BASE_URL}/products?category=${category}` 
      : `${API_BASE_URL}/products`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    } catch (e) {
      // Fallback for demo purposes if backend isn't running yet
      console.warn("API unavailable, check Spring Boot console. Returning empty array.");
      return [];
    }
  },

  // Orders
  placeOrder: async (order: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error('Order placement failed');
    return response.json();
  },

  getOrders: async (userId: string): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    if (!response.ok) return [];
    return response.json();
  }
};
