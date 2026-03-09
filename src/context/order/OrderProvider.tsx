import { useState } from 'react';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

import type { Order } from './OrderContext';
import { OrderContext } from './OrderContext';

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<Order | null>(null);

  const buildOrderPayload = (order: Order) => {
    const { customer, fulfillment, items, totalAmount } = order;

    const customerPayload =
      fulfillment.deliveryType === 'pickup'
        ? {
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            note: customer.note,
          }
        : {
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            deliveryPostalCode: customer.deliveryPostalCode,
            deliveryAddress: customer.deliveryAddress,
            note: customer.note,
          };

    const fulfillmentPayload =
      fulfillment.deliveryType === 'pickup'
        ? {
            orderStoreId: fulfillment.orderStoreId,
            pickupStoreId: fulfillment.pickupStoreId,
            deliveryType: fulfillment.deliveryType,
            deliveryDate: fulfillment.deliveryDate,
            deliveryFrom: fulfillment.deliveryFrom,
          }
        : {
            orderStoreId: fulfillment.orderStoreId,
            deliveryType: fulfillment.deliveryType,
            deliveryDate: fulfillment.deliveryDate,
            deliveryFrom: fulfillment.deliveryFrom,
            deliveryTo: fulfillment.deliveryTo,
          };

    const itemsPayload = items.map((i) => ({
      productId: i.id,
      price: i.price,
      quantity: i.quantity,
    }));

    return {
      customer: customerPayload,
      fulfillment: fulfillmentPayload,
      items: itemsPayload,
      totalAmount,
    };
  };

  const createOrder = async (order: Order) => {
    const payload = buildOrderPayload(order);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 422) {
        const message = await getFirstValidationMessage(res);
        throw new Error(message);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    setOrder(order);
  };

  const resetOrder = () => {
    setOrder(null);
  };

  return (
    <OrderContext.Provider value={{ order, createOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
