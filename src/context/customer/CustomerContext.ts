import { createContext } from 'react';

export interface OrderCustomerInput {
  name: string;
  address: string;
  phone: string;
  orderStoreId: string;
  deliveryType: 'pickup' | 'delivery';
  pickupStoreId?: string;
  deliveryAddress?: string;
  deliveryPostalCode?: string;
  note?: string;
}

interface CustomerContextType {
  customer: OrderCustomerInput;
  updateCustomer: (data: Partial<OrderCustomerInput>) => void;
  resetCustomer: () => void; //まだリセット機能は作らない
}

export const CustomerContext = createContext<CustomerContextType | null>(null);
