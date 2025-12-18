import { CustomerContext } from "@/context/CustomerContext"
import { CartContext } from "@/context/CartContext"

import { useContext } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

function Confirm () {
    const customerContext = useContext(CustomerContext) 
    if(!customerContext) return null
    const {customer} = customerContext

    const cartContext = useContext(CartContext)
    if(!cartContext) return null
    const {items, totalPrice,totalItem} = cartContext



    return(<>
        <Label >名前</Label>
    <Input  value={customer.name} readOnly />
    <Label >住所</Label>
    <Input  value={customer.address} readOnly />
    <Label  >電話番号</Label>
    <Input  value={customer.phone} readOnly />
    
    <div className="flex">
    <Table className="">
        <TableHeader>
            <TableRow>
                <TableHead></TableHead>
                <TableHead>商品名</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>単価</TableHead>
                <TableHead>小計</TableHead>
            </TableRow>
        </TableHeader>
        {items.map((item)=>(
        <TableBody className="border-b" key={item.id}>
            <TableRow >
                <TableCell className="w-25" ><img className="h-20 w-20 object-cover rounded-md shrink " src={item.img} alt="画像" /></TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}個</TableCell>
                <TableCell>¥{item.price}</TableCell>
                <TableCell>¥{(item.price * item.quantity).toLocaleString('ja-JP') }</TableCell>
            </TableRow>
        </TableBody>
        ))}
    </Table>

    <div className=" w-1/2 mt-2 border rounded h-60 flex flex-col justify-between bg-gray-100">
        <div className="p-2 flex justify-between">
            <p>商品小計({totalItem}点)</p>
            <p className=" text-xl font-medium text-red-400">¥{totalPrice.toLocaleString('ja-JP')}円</p>
        </div>
        <div className="p-2 flex flex-col">        
        <Button className="w-full mb-1 h-15 bg-rose-500 hover:bg-rose-800 text-xl font-medium">注文を確定する</Button>
        <Button className="w-full h-15 bg-gray-500 hover:bg-gray-800 text-xl font-medium"><Link to="/carts" >カートに戻る</Link></Button>
        </div>
    </div>
    </div>
    </>)

}

export default Confirm