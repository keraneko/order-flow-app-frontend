import { type Customer } from './customer';
import type { Product } from './product';
import type { StoreSummary } from './store';

export type OrderStatus = 'received' | 'canceled' | 'completed';

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface OrderIndex {
  id: number;
  orderedAt: string;
  status: OrderStatus;
  totalAmount: number;
}

export interface OrderShow {
  id: number;
  orderedAt: string;
  status: OrderStatus;
  deliveryType: 'pickup' | 'delivery';
  pickupStore: StoreSummary | null;
  deliveryAddress?: string;
  deliveryPostalCode?: string;
  note?: string;
  totalAmount: number;
  customer: Customer;
  items: OrderItem[];
}

export interface Order {
  id: number;
  orderedAt: string;
  status: OrderStatus;
  totalAmount: number;
}
