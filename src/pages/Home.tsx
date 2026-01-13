import {Card} from "@/components/ui/card"
import {Button} from '@/components/ui/button.tsx'

import {getProduct, type Product} from "@/types/Products" 
import {useState,useEffect} from 'react'
import { useCart } from "@/context/cart/useCart"

function Home() {

    const {addItem} = useCart()
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

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProduct()
        .then((data: Product[]) => {
        setProducts(data);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (<>
    <h2>商品一覧ページ</h2>    
    <div className="grid grid-cols-3 gap-2 w-full">
        {products.map( item =>(
        <Card key={item.id} className="flex flex-col h-80 p-0">
            <div className="m-auto relative">
                <img  src={item.img} alt={item.name}
                  className=
                  {`object-contain h-44 rounded bg-gray-100
                    ${!item.isActive ?"grayscale opacity-60" : ""}`
                  }/>
                  {!item.isActive &&
                  <div className=" absolute inset-0 flex items-center justify-center">
                    <span className="rounded px-3 py-1 text-sm font-bold bg-black/70 text-white">
                        SOLD OUT
                    </span>
                  </div>}
            </div>
            <div className="flex flex-col justify-between p-1 ">
                
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.price}円</p>
                </div>
                <div className="flex p-2">
                    <select className="border rounded h-full m-auto w-20 bg-amber-50" name="quanity" id="quanity"
                     value={quantities[item.id] || 1} onChange={(e)=>handleQuantityChange(item.id,Number(e.target.value))}>
                        {[...Array(30).keys()].map((index)=>(<option key={index} value={index + 1}>{index + 1}</option>))}
                    </select>  
                    <Button onClick={ () => {
                        if(!item.isActive) return;
                        addToCart(item);}}
                        className={!item.isActive ? "bg-gray-400 mt-auto":"bg-amber-400 mt-auto"}
                        disabled={!item.isActive}>
                        {!item.isActive ?"SOLD OUT" :"カートに入れる"}</Button>
                    
                </div>
        </Card>
        ))}
    </div>
    </>)

}

export default Home;