// import { CartContext } from '@/contexts/CartContext'
// import {useContext} from 'react'

// const CartList = () => {
//     const {items} = useContext(CartContext)

//     return(<>
//         <h2>カートの中身</h2>
//         {items.map( (item)=>(
//             <div key={item.id}>
//             <p >{item.name}</p>
//             <p >{item.price}円</p>
//             <p >{item.quantity}個</p>
//             </div>
//         ))}
//         </>) 
// }

// export default CartList

import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,TableFooter} from "@/components/ui/table"

function CartList() {
  const { items, updateQuantity, removeItem,totalPrice } = useContext(CartContext);

  return (
    <>
    <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="">注文商品</TableHead>
      <TableHead>単価</TableHead>
      <TableHead>数量</TableHead>
    </TableRow>
  </TableHeader>
{items.map((item) =>(
  <TableBody key={items.id}>
    <TableRow>
      <TableCell className="">{item.name}</TableCell>
      <TableCell>{item.price}円</TableCell>
      <TableCell>{item.quantity}個</TableCell>
      <TableCell><Button className="bg-red-400" onClick={ ()=> removeItem(item.id)}>削除</Button></TableCell>
      <TableCell><Button className="bg-blue-400" onClick={ ()=> updateQuantity(item.id, item.quantity - 1)}>減算</Button></TableCell>
      <TableCell><Button className="bg-blue-400" onClick={ ()=> updateQuantity(item.id, item.quantity + 1)}>加算</Button></TableCell>
    </TableRow>   
  </TableBody>
  ))}
  <TableFooter>
    <TableRow>
        <TableCell className="" colSpan={1} >合計金額</TableCell>
        <TableCell className="text-red-400 text-2xl text-right " >{totalPrice}円</TableCell>
    </TableRow>
    </TableFooter> 
</Table>
</>
  );
}

export default CartList;
