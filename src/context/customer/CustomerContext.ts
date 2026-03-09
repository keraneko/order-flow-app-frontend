import { createContext } from 'react';
import { type OrderCustomerInput } from '@/types/customer';

interface CustomerContextType {
  customer: OrderCustomerInput;
  updateCustomer: (data: Partial<OrderCustomerInput>) => void;
  resetCustomer: () => void; //まだリセット機能は作らない
}

export const CustomerContext = createContext<CustomerContextType | null>(null);
