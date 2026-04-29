import { useState } from 'react';
import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';

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
            pickupStoreId: fulfillment.pickupStoreId,
            deliveryType: fulfillment.deliveryType,
            deliveryDate: fulfillment.deliveryDate,
            deliveryFrom: fulfillment.deliveryFrom,
          }
        : {
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
    try {
      const payload = buildOrderPayload(order);

      await apiClient.post('/api/orders', payload);

      setOrder(order);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 422) {
          throw new Error(
            getFirstAxiosValidationMessage(e.response?.data) ??
              '入力内容が間違っています',
          );
        }
        throw new Error(
          status !== undefined ? `HTTP: ${status}` : '注文の登録に失敗しました',
        );
      }

      throw new Error('注文の登録に失敗しました');
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
