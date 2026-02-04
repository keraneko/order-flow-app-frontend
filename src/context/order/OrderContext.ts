import { createContext } from 'react';
import type { Customer } from '@/context/customer/CustomerContext';

import type { CartItem } from '../cart/CartContext';

export interface Order {
  customer: Customer;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
}

interface OrderContextType {
  order: Order | null;
  createOrder: (order: Order) => Promise<void>;
  resetOrder: () => void;
}

export const OrderContext = createContext<OrderContextType | null>(null);
