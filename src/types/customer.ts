export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface OrderCustomerInput {
  name: string;
  address: string;
  phone: string;
  deliveryAddress?: string;
  deliveryPostalCode?: string;
  note?: string;
}
