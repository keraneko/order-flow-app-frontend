import { useState } from 'react';
import { getFirstValidationMessage } from '@/Utils/LaravelValidationError';

import type { Order } from './OrderContext';
import { OrderContext } from './OrderContext';

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<Order | null>(null);

  const createOrder = async (order: Order) => {
    setOrder(order);
    const customer = { ...order.customer };

    if (customer.deliveryType === 'pickup') {
      delete customer.deliveryAddress;
      delete customer.deliveryPostalCode;
    } else {
      delete customer.pickupStoreId;
    }

    const payload = {
      customer,
      items: order.items,
      totalAmount: order.totalAmount,
    };

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
