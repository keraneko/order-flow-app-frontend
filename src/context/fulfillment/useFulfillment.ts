import { useContext } from 'react';

import { FulfillmentContext } from './FulfillmentContext';

export const useFulfillment = () => {
  const context = useContext(FulfillmentContext);

  if (!context) {
    throw new Error('useFulfillment must be used within FulfillmentProvider');
  }

  return context;
};
