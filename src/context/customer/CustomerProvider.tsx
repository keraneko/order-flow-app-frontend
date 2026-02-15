import { useState } from 'react';

import type { OrderCustomerInput } from './CustomerContext';
import { CustomerContext } from './CustomerContext';

const initialCustomer: OrderCustomerInput = {
  name: '',
  address: '',
  phone: '',
  orderStoreId: '',
  deliveryType: 'pickup',
  pickupStoreId: '',
  deliveryAddress: '',
  deliveryPostalCode: '',
  note: '',
};

export const CustomerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [customer, setCustomer] = useState<OrderCustomerInput>(initialCustomer);

  const updateCustomer = (data: Partial<OrderCustomerInput>) => {
    setCustomer((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetCustomer = () => {
    setCustomer(initialCustomer);
  };

  return (
    <CustomerContext.Provider
      value={{ customer, updateCustomer, resetCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
