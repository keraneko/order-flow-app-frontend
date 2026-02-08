export type OrderStatus = 'received' | 'canceled' | 'completed';

export interface Order {
  id: number;
  orderedAt: string;
  status: OrderStatus;
  totalAmount: number;
}
