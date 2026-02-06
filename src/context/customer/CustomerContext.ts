import { createContext } from 'react';

export interface Customer {
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
  customer: Customer;
  updateCustomer: (data: Partial<Customer>) => void;
  resetCustomer: () => void; //まだリセット機能は作らない
}

export const CustomerContext = createContext<CustomerContextType | null>(null);
