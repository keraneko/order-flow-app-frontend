import { type Order } from '@/types/Order';

export interface OrderApi {
  id: number;
  ordered_at: string;
  status: 'received' | 'canceled' | 'completed';
  total_amount: number;
}

const toOrder = (o: OrderApi): Order => ({
  id: o.id,
  orderedAt: o.ordered_at,
  status: o.status,
  totalAmount: o.total_amount,
});

export async function getOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders');

  if (!res.ok) throw new Error(`HTTP${res.status}`);
  const data = (await res.json()) as OrderApi[];

  return data.map(toOrder);
}
