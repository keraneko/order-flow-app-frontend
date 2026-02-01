
import { useState } from "react"; 

import type { Customer } from "./CustomerContext";
import { CustomerContext } from "./CustomerContext";

const initialCustomer: Customer = {
  name: "",
  address: "",
  phone: "",
  orderStoreId: "",
  deliveryType: "pickup",
  pickupStoreId: "",
  deliveryAddress: "",
  note: "",
}

 export const CustomerProvider = ({children}: { children: React.ReactNode }) => {
   const[customer,setCustomer] = useState<Customer>(initialCustomer)

   const updateCustomer = (data: Partial<Customer>) => {
      setCustomer((prev)=>({
        ...prev,
        ...data,
      }))
   }

   const resetCustomer = () => {
    setCustomer(initialCustomer);
  };
    

 

  return (
    <CustomerContext.Provider value={{customer,updateCustomer,resetCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}


