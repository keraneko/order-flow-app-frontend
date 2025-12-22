import { useCustomer } from "@/context/customer/useCustomer"
import { useCart } from "@/context/cart/useCart"
import { useOrder } from "@/context/order/useOrder"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Textarea } from "@/components/ui/textarea"
import stores from "@/Stores"

function Confirm () {
    const {customer} = useCustomer() 
    const {items, totalPrice,totalItem} = useCart()
    const {createOrder} = useOrder()

    const totalAmount = totalPrice
    const handleConfirm = () => {
        createOrder({
            customer,
            items,
            totalAmount,
            createdAt: new Date().toISOString(),
        })
    }


    return(<>    
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
            <Button onClick={handleConfirm} className="w-full mb-1 h-15 bg-rose-500 hover:bg-rose-800 text-xl font-medium">注文を確定する</Button>
            <Link to="/carts" ><Button className="w-full h-15 bg-gray-500 hover:bg-gray-800 text-xl font-medium">カートに戻る</Button></Link>
            </div>
        </div>
    </div>
    <div>
    <p>お客様情報</p>
    <Label htmlFor="name" className="py-2" >名前</Label>
    <Input name="name" value={customer.name} readOnly />
    <Label htmlFor="address" className="py-2">住所</Label>
    <Input name="address" value={customer.address} readOnly />
    <Label htmlFor="phone" className="py-2">電話番号</Label>
    <Input name="phone" value={customer.phone} readOnly />
    <p className="py-2">受取方法: <span className="font-black">{customer.deliveryType === "pickup" ? "店舗受取" : "配達"}</span></p>

    {customer.deliveryType === 'pickup' && (<div className="py-2 ">
        <p>
            受取店舗: <span className="font-black">{stores.find( store => store.id === customer.pickupStoreId )?.name}</span>
        </p>
    </div>)}

    {customer.deliveryType === "delivery" && (
    <div>
        <Label className="py-2"  id="deliveryAddress" >配達先住所</Label>
        <Input value={customer.deliveryAddress} readOnly />
    </div>)}
    <Label className="py-2" id="note" >備考</Label>
    <Textarea disabled value={customer.note} ></Textarea>
    </div>
    </>)

}

export default Confirm