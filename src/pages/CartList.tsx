import { useContext,useState,useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import {Plus,Minus,Trash2} from 'lucide-react'
import { Button } from "@/components/ui/button";

function CartItem({item}) {
    const { updateQuantity,removeItem } = useContext(CartContext);
    const [tempQty, setTempQty] = useState(String(item.quantity));
    useEffect(() => {setTempQty(String(item.quantity))},
    [item.quantity])


    return(
        <>
        <div className="flex items-center max-w-5xl border-b p-1">
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
                    <input className="w-10 h-10 text-center border rounded text-base "
                        type="number"
                        value={tempQty}
                        onChange={(e) => setTempQty(e.target.value)}
                        onBlur={() => {
                            const num = Number(tempQty);
                            if (!Number.isNaN(num) && num > 0) {
                            updateQuantity(item.id, num);
                            } else {
                            setTempQty(String(item.quantity));
                            }
                        }}
                    />
                    <Plus className="border-2 rounded w-10 h-10 " onClick={() => { updateQuantity(item.id, item.quantity + 1)}} />  
                    <p className="text-base font-medium ">¥ {(item.price * item.quantity).toLocaleString('ja-JP')}</p>
                </div>
            </div>
        </div>
    </>
  );
}
 
function CartList() {
  const { items,totalPrice, totalItem } = useContext(CartContext);

  return (
    <>
    {items.map((item) => (
        <div key={item.id} className="">
            <CartItem item={item} />
        </div>
    ))}
    <div className=" mt-2 border rounded h-20 flex flex-col justify-between bg-gray-100">
        <div className="flex justify-between">
            <p>商品小計({totalItem}点)</p>
            <p className="text-xl font-medium text-red-400">¥{totalPrice.toLocaleString('ja-JP')}円</p>
        </div>        
        <Button className="w-full bg-rose-500 hover:bg-rose-800 text-xl font-medium">次へ進む</Button>
    </div>
</>
  );
}

export default CartList;