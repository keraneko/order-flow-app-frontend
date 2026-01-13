import {Card} from "@/components/ui/card"
import {Button} from '@/components/ui/button.tsx'
import {getProduct, type Product} from "@/types/Products" 
import {useState,useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom"

function ProductsPage() {
    const navigate = useNavigate()

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
    <div className="flex justify-between items-center py-2">
    <h2>商品一覧ページ</h2>
    <Link to={"/products/new"}><Button className="bg-blue-400 text-xl">新規登録</Button></Link>
    </div>    
    <div className="grid grid-cols-3 gap-2 w-full">
        {products.map( item =>(
        <Card key={item.id} className="flex flex-col h-80 p-0">
            <div className="m-auto relative">
                <img  src={item.img} alt={item.name} className="object-contain h-44 rounded bg-gray-100"/>
            </div>
            <div className="flex justify-between p-1 ">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.price}円</p>
                    {item.isActive ?
                    <p className="border bg-blue-400 rounded text-white text-base">販売中</p> :
                    <p className="border bg-red-400 rounded text-white text-base">販売停止中</p>}
                </div>
                    <Button onClick={()=>(navigate(`/products/${item.id}/edit`))} >編集する</Button>
        </Card>
        ))}
    </div>
    </>)
}

export default ProductsPage




