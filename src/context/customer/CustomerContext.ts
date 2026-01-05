
import { createContext} from "react"; 

export type Customer = { 
  name: string;
  address: string;
  phone: string;
  orderStoreId: string;
  deliveryType: "pickup" | "delivery",
  pickupStoreId?: string,
  deliveryAddress?: string,
  note?: string,
}

type CustomerContextType = {
  customer: Customer;
  updateCustomer: (data: Partial<Customer>) => void;
  resetCustomer: () => void; //まだリセット機能は作らない
}

 export const CustomerContext = createContext<CustomerContextType | null> (null);