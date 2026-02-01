import {useEffect,useState} from 'react'
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {getStore, type Store} from "@/types/Stores" 

function StoresPage() {

    const [stores, setSores] = useState<Store[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
    
        useEffect(() => {
            getStore()
            .then((data: Store[]) => {
            setSores(data);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
        }, []);
    
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;

    
    

    return (<>
    <div className="flex justify-between items-center py-2">
    <h2>店舗情報</h2>
    <Link to={"/stores/new"}><Button className="">店舗情報を登録する</Button></Link>
    </div> 
    <div className="grid grid-cols-3 gap-2 w-full">
        {stores.map( store =>(
        <div key={store.id} className="flex flex-col h-80 p-0"> 
            <div className="flex justify-between p-1 ">
                <Link to={`/stores/${store.id}/edit`} >
                    <p className="font-semibold text-blue-500 hover:text-blue-100">{store.name}</p>
                </Link>
            </div>
        </div>
        ))}
    </div>
    </>)
}

export default StoresPage