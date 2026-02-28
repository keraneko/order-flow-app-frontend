import { useState } from 'react';

import { FulfillmentContext, type FulfillmentType } from './FulfillmentContext';

const initialFulfillment: FulfillmentType = {
  orderStoreId: null,
  pickupStoreId: null,
  deliveryType: 'pickup',
  deliveryDate: '',
  deliveryFrom: '',
  deliveryTo: '',
};

export const FulfillmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fulfillment, setFulfillment] =
    useState<FulfillmentType>(initialFulfillment);

  const updateFulfillment = (data: Partial<FulfillmentType>) => {
    setFulfillment((prev) => {
      const next: FulfillmentType = { ...prev, ...data };

      const switchedToPickup =
        prev.deliveryType !== 'pickup' && next.deliveryType === 'pickup';

      if (!switchedToPickup) return next;

      if (next.pickupStoreId !== null) return next;

      if (next.orderStoreId === null) return next;

      // 一回だけpickupStoreIdにデータを入れる
      return { ...next, pickupStoreId: next.orderStoreId };
    });
  };

  return (
    <FulfillmentContext.Provider value={{ fulfillment, updateFulfillment }}>
      {children}
    </FulfillmentContext.Provider>
  );
};
