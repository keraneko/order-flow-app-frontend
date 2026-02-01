import {useEffect,useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {Button} from '@/components/ui/button.tsx'
import {Card} from "@/components/ui/card"
import {getProduct, type Product} from "@/types/Products" 

type VisibilityFilter = "visible" | "hidden" | "all"

function ProductsPage() {
    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] =useState<VisibilityFilter>("visible")
    const [submittingIds, setSubmittingIds] = useState<Record<number, boolean>>({})
    
    const handleRestore = async(id:number, nextvisible:boolean) => {
        if(submittingIds[id])return
        
        setSubmittingIds((prev)=>({...prev, [id]: true}))
        try {
        const res = await fetch(`/api/products/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
            body: JSON.stringify({ is_active: nextvisible}),
        });

        if (!res.ok) {
        if (res.status === 422) {
            const err = await res.json();
            const firstArray = Object.values(err.errors ?? {})[0] as string[] | undefined;
            toast.error(firstArray?.[0] ?? "入力内容を確認してください");
            return;
        }
            toast.error("更新に失敗しました");
            return;
        }

        setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: nextvisible } : p))
        );

        toast.success("更新しました");
        } finally {
        setSubmittingIds((prev) => ({ ...prev, [id]: false }));
        }
    };

    const filteredProducts = products.filter((p) =>{
        if(filter === "visible") return p.isVisible === true;
        if(filter === "hidden") return p.isVisible === false;
        return true
     })
   

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
    <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as VisibilityFilter)}
        className="border rounded px-2 py-1"
        >
        <option value="visible">表示中</option>
        <option value="hidden">非表示</option>
        <option value="all">すべて</option>
    </select>
    <Link to={"/products/new"}><Button className="bg-blue-400 text-xl">新規登録</Button></Link>
    </div> 
    <div className="grid grid-cols-3 gap-2 w-full">
        {filteredProducts.map( item =>(
        <Card key={item.id} className="flex flex-col h-80 p-0"> 
            <div className="m-auto relative">
                {item.image ?
                (<img  src={`http://localhost/storage/${item.image}`}alt={item.name} className="object-contain h-44 rounded bg-gray-100"/>)
                 : (<div>Not Image</div>)}
                
            </div>
            <div className="flex justify-between p-1 ">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.price}円</p>
                    {/* {item.isActive ?
                    <p className="border bg-blue-400 rounded text-white text-base">販売中</p> :
                    <p className="border bg-red-400 rounded text-white text-base">販売停止中</p>} */}
                </div>
                <div className="flex justify-between">
                    <Button className="m-2" onClick={()=>(navigate(`/products/${item.id}/edit`))} >編集する</Button>

                    
                        <Button className={`mt-2 ${item.isActive?"bg-red-400" :"bg-blue-400" }`}
                            onClick={() => handleRestore(item.id, !item.isActive)}
                            disabled={!!submittingIds[item.id]}>
                            {item.isActive ? "販売停止にする": "販売中にする"}
                        </Button>
                </div>

        </Card>
        ))}
    </div>
    </>)
}

export default ProductsPage