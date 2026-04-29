import { createContext } from 'react';

export interface FulfillmentType {
  pickupStoreId: number | null;
  deliveryType: 'pickup' | 'delivery';
  deliveryDate: string;
  deliveryFrom: string;
  deliveryTo: string;
}
interface FulfillmentContextType {
  fulfillment: FulfillmentType;
  updateFulfillment: (data: Partial<FulfillmentType>) => void;
  resetFulfillment: () => void;
}

export const FulfillmentContext = createContext<FulfillmentContextType | null>(
  null,
);
