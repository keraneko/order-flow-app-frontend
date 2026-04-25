import { useState } from 'react';

import { FulfillmentContext, type FulfillmentType } from './FulfillmentContext';

const initialFulfillment: FulfillmentType = {
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
    setFulfillment((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetFulfillment = () => {
    setFulfillment(initialFulfillment);
  };

  return (
    <FulfillmentContext.Provider
      value={{ fulfillment, updateFulfillment, resetFulfillment }}
    >
      {children}
    </FulfillmentContext.Provider>
  );
};
