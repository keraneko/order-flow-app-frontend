import { useContext } from "react";
import { OrderContext } from "./OrderContext";

export const useOrder = () => {
   const context = useContext(OrderContext)

   if(!context) {
        throw new Error ("useCustomer must be used within CustomerProvider") //間違った使い方をしたらエラーを出す
   }

   return context
} 