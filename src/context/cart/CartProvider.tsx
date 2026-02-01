import { useState } from 'react';

import type { CartItem } from './CartContext'; 
import {CartContext} from './CartContext'



 export const CartProvider = ({ children}:{ children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((p)=>(p.id === item.id));

      if (exists) {
        return prev.map((p) => 
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        )
      }
    
      return [...prev, item]
    })
  };

   const updateQuantity = (id: number, newQuantity: number) => {
    //if(!Number.isInteger(newQuantity) || newQuantity < 1) return
    if(newQuantity === 0){setItems((prev) => prev.filter(item => item.id !== id))}
    setItems((prev) =>
      prev.map( item =>
        item.id === id ? {...item,quantity: newQuantity} : item
      )) 
      
  }

  const removeItem =(id: number) => {
    setItems((prev) => prev.filter(item => item.id !== id))
  }

  const totalPrice = items.reduce((total, item)=>{
    return total + item.price * item.quantity
  }, 0)

  const totalItem = items.reduce((total, item) => {
    return total + item.quantity
  },0)

  

  return (
    <CartContext.Provider value={{ items, addItem,updateQuantity, removeItem, totalPrice, totalItem }}>
      {children}
    </CartContext.Provider>
  );
};



