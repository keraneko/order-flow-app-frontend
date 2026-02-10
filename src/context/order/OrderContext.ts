import { createContext } from 'react';
import type { OrderCustomerInput } from '@/context/customer/CustomerContext';

import type { CartItem } from '../cart/CartContext';

export interface Order {
  customer: OrderCustomerInput;
  items: CartItem[];
  totalAmount: number;
}

interface OrderContextType {
  order: Order | null;
  createOrder: (order: Order) => Promise<void>;
  resetOrder: () => void;
}

export const OrderContext = createContext<OrderContextType | null>(null);
