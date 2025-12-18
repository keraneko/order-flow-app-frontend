import { createContext, useState } from "react"; 

type Customer = { 
  name: string;
  address: string;
  phone: string;
}

type CustomerContextType = {
  customer: Customer;
  updateCustomer: (data: Partial<Customer>) => void;
  resetCustomer: () => void; //まだリセット機能は作らない
}

const initialCustomer: Customer = {
  name: "",
  address: "",
  phone: "",
}

 export const CustomerContext = createContext<CustomerContextType | null> (null);
  
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


