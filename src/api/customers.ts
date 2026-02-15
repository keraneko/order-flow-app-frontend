import { type Customer } from '@/types/customer';

export interface CustomerApi {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export const toCustomer = (c: CustomerApi): Customer => ({
  id: c.id,
  name: c.name,
  address: c.address,
  phone: c.phone,
});
