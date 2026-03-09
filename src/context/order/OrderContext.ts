import { createContext } from 'react';
import type { CartItem } from '@/context/cart/CartContext';
import type { OrderCustomerInput } from '@/context/customer/CustomerContext';
import type { FulfillmentType } from '@/context/fulfillment/FulfillmentContext';

export interface Order {
  fulfillment: FulfillmentType;
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
