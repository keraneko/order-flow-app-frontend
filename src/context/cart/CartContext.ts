import { createContext } from 'react';
import type { Product } from '@/types/Products';

export type CartItem = Product & {
  quantity: number;
};

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItem: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
