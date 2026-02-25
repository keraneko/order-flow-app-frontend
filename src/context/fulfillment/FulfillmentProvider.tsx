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

      if (
        data.deliveryType === 'pickup' &&
        prev.pickupStoreId === null &&
        next.orderStoreId === null
      ) {
        next.pickupStoreId = next.orderStoreId;
      }

      return next;
    });
  };

  return (
    <FulfillmentContext.Provider value={{ fulfillment, updateFulfillment }}>
      {children}
    </FulfillmentContext.Provider>
  );
};
