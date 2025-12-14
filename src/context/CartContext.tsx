// import { createContext, useContext, useState } from "react";

// // 1. Context の「箱」を作る
// const CartContext = createContext({
//   items: [],
//   addItem: (item: any) => {},
// });

// // 2. Provider コンポーネント
// export const CartProvider = ({ children }) => {
//   const [items, setItems] = useState([]); // ← 初期値は「箱だけ」その通り！

//   const addItem = (item) => {
//     setItems((prev) => [...prev, item]);
//   };

//   return (
//     <CartContext.Provider value={{ items, addItem }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // 3. 使いやすいようにカスタムフックを作る
// export const useCart = () => useContext(CartContext);

// CartContext.tsx
import { createContext, useState } from "react";
import type {Product} from "@/Products.tsx" 



type CartContextType={
  items: Product[];
  addItem: (item: Product) => void;
  updateQuantity: (id: number, quanity: number) => void;
  removeItem: (id: number) =>void;  

}

 export const CartContext = createContext<CartContextType | undefined>(undefined);


 export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
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

   const updateQuantity = (id, newQuantity) => {
    if(newQuantity<1) return
    if(newQuantity === 0 ){
      return setItems((prev) => prev.filter(item => item.id !== id))
    } else{
    setItems((prev) =>
      prev.map( item =>
        item.id === id ? {...item,quantity: newQuantity} : item
      )) 
      }
  }

  const removeItem =(id) => {
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



