import { useContext } from "react";
import { CustomerContext } from "./CustomerContext";

export const useCustomer = () => {
   const context = useContext(CustomerContext)

   if(!context) {
        throw new Error ("useCustomer must be used within CustomerProvider") //間違った使い方をしたらエラーを出す
   }

   return context
} 