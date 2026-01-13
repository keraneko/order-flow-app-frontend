import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/cart/useCart";
import {Plus,Minus,Trash2} from 'lucide-react'
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/context/cart/CartContext";

type CartItemProps = {
    item: CartItem
}
function CartItems({item}: CartItemProps) {
    const { updateQuantity,removeItem } = useCart()
    // const [tempQty, setTempQty] = useState(String(item.quantity));

    // const handleBlur =() => {
    //     const num = Number(tempQty);
    //     if (Number.isNaN(num) && num < 1) {
    //     setTempQty(String(item.quantity))
    //     return
    //     } 
    //     updateQuantity(item.id,num)
    //     }

    const [showBlukButton,setShowBlukButton] = useState(false)
    
    return(
        <>
        
        <Button className="bg-white text-black border" onClick={ () => setShowBlukButton(prev => !prev)}>more</Button>
        <div className="flex items-center max-w-5xl border-b p-1 mb-2">
            <Trash2 className="m-2 text-red-500 border-2 rounded w-10 h-10 " onClick={ () =>{removeItem(item.id)} } />
            <div>
                <img className="w-40 h-20 object-cover rounded-md shrink" src={item.img} alt="画像" />
            </div>
            <div className="flex flex-col justify-between w-full h-20 pl-4">
                <div>
                    <p className="text-base font-medium leading-tight">{item.name}</p>
                </div>
                <div className=" flex  justify-between items-center">
                    <Minus className="border-2 rounded w-10 h-10 " onClick={() => {updateQuantity(item.id, item.quantity - 1)}} />
                    <div className="w-10 h-10 border rounded text-base flex justify-center items-center m-1">
                        <p> {item.quantity}</p>
                    </div>
                    <Plus className="border-2 rounded w-10 h-10 " onClick={() => { updateQuantity(item.id, item.quantity + 1)}} />  
                    <p className="text-base font-medium ">¥ {(item.price * item.quantity).toLocaleString('ja-JP')}</p>
                </div>
            </div>
        </div>
        {showBlukButton && (<div className="flex justify-end">
            <Button onClick={() => { updateQuantity(item.id, item.quantity + 10)}} >+10</Button>
            <Button onClick={() => { updateQuantity(item.id, item.quantity + 100)}}>+100</Button>
        </div>)}
    </>
  );
}
 
function CartList() {
  const { items,totalPrice, totalItem } = useCart()

   //cartError
    const[cartError, setCartError] = useState<string | null>(null)
    const navigate = useNavigate()
    const onNext = () => {
        if (items.length === 0) {setCartError("商品を選択してください"); return; }
        setCartError(null);
        navigate("/customers")
    }

  return (
    <>
    {items.map((item) => (
        <div key={item.id} className="">
            <CartItems item={item} />
        </div>
    ))}
    <div className=" mt-2 border rounded h-20 flex flex-col justify-between bg-gray-100">
        {cartError && items.length === 0 && <p className="text-red-500 text-sm">{cartError}</p>}
        <div className="flex justify-between">
            <p>商品小計({totalItem}点)</p>
            <p className="text-xl font-medium text-red-400">¥{totalPrice.toLocaleString('ja-JP')}円</p>
        </div>        
        <Button onClick={onNext}  className="w-full bg-rose-500 hover:bg-rose-800 text-xl font-medium">次へ進む</Button>
    </div>
</>
  );
}

export default CartList;