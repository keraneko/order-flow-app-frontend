import type {
  OrderIndex,
  OrderItem,
  OrderShow,
  OrderStatus,
} from '@/types/order';
import type { StoreSummary } from '@/types/store';

import { type CustomerApi, toCustomer } from './customers';
import { type ProductApi, toProduct } from './products';

//OrderIndex用変換

interface OrderApiIndex {
  id: number;
  ordered_at: string;
  status: OrderStatus;
  total_amount: number;
}

const toOrderIndex = (o: OrderApiIndex): OrderIndex => ({
  id: o.id,
  orderedAt: o.ordered_at,
  status: o.status,
  totalAmount: o.total_amount,
});

//OrderIndexへのfetch
export async function getOrders(): Promise<OrderIndex[]> {
  const res = await fetch('/api/orders');

  if (!res.ok) throw new Error(`HTTP${res.status}`);
  const data = (await res.json()) as OrderApiIndex[];

  return data.map(toOrderIndex);
}

//OrderShow用変換

interface OrderItemsApi {
  product: ProductApi;
  quantity: number;
  unit_price: number;
}

const toOrderItems = (i: OrderItemsApi): OrderItem => ({
  product: toProduct(i.product),
  quantity: i.quantity,
  unitPrice: i.unit_price,
});

interface OrderApiShow {
  id: number;
  ordered_at: string;
  status: OrderStatus;
  total_amount: number;
  delivery_type: 'pickup' | 'delivery';
  pickup_store: StoreSummary | null;
  delivery_address?: string;
  delivery_postal_code?: string;
  note?: string;
  customer: CustomerApi;
  items: OrderItemsApi[];
}
const toOrderShow = (o: OrderApiShow): OrderShow => ({
  id: o.id,
  orderedAt: o.ordered_at,
  status: o.status,
  totalAmount: o.total_amount,
  deliveryType: o.delivery_type,
  pickupStore: o.pickup_store,
  deliveryAddress: o.delivery_address,
  deliveryPostalCode: o.delivery_postal_code,
  note: o.note,
  customer: toCustomer(o.customer),
  items: o.items.map(toOrderItems),
});

//OrderShowへのfetch
export async function getOrder(id: number): Promise<OrderShow> {
  const res = await fetch(`/api/orders/${id}`);

  //if (res.status === 404) return null;

  if (!res.ok) throw new Error(`HTTP${res.status}`);
  const data = (await res.json()) as OrderApiShow;

  return toOrderShow(data);
}
