import {Card} from "@/components/ui/card"
import {Button} from '@/components/ui/button.tsx'
import '../App.css'
import products from "@/Products.tsx"
import type {Product} from "@/Products.tsx" 
import {useState,useContext} from 'react'
import { CartContext } from "@/contexts/CartContext"

function Home() {

    const {addItem} = useContext(CartContext);
    const [quantities,setQuantities] = useState<Record<number, number>>({});
     

    const handleQuantityChange = (id:number, value:number ) =>{
        setQuantities(prev =>({
            ...prev,
            [id]:value,
        }));
    };

    const addToCart = (product:Product) => {
        const quantity = quantities[product.id] || 1;

        addItem(
            {
                ...product,
                quantity: quantity,
            }
        );
    };

    return (<>
    <h1>商品一覧ページordersも兼ね備えている</h1>    
    <div className="grid grid-cols-3 gap-4">
        {products.map( item =>(
        <Card key={item.id} className="flex flex-col h-full p-0">
            <div className="m-auto">
                <img  src={item.img} alt="テスト"  className=" object-contein h-44 rounded"/>
            </div>
            <div className="flex flex-col justify-between p-1 ">
                
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.price}円</p>
                </div>
                <div className="flex p-2">
                    <select className="border rounded h-full m-auto w-12 bg-amber-50" name="quanity" id="quanity"
                     value={quantities[item.id] || 1} onChange={(e)=>handleQuantityChange(item.id,Number(e.target.value))}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <Button onClick={ () => addToCart(item)} className="bg-amber-400 mt-auto">カートに入れる</Button>
                </div>
        </Card>
        ))}
    </div>
    </>)

}

export default Home;