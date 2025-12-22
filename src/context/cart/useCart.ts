import { useContext } from "react";
import { CartContext } from "./CartContext"; 

export const useCart = () => {
   const context = useContext(CartContext)

   if(!context) {
        throw new Error ("useCustomer must be used within CustomerProvider") //間違った使い方をしたらエラーを出す
   }

   return context
} 