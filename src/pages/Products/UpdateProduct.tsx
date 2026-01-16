
import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { CreateProductInput } from "@/types/Products"
import { normalizeNumberString } from "@/Utils/NumberString";
import ProductForm from "./ProductForm"
import { toast } from "sonner";

const createProductInput: CreateProductInput  ={
        name: "",
        price: "",
        isActive: true,
    }

function UpdateProductPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const[productInput, setProductInput] = useState<CreateProductInput>(createProductInput)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() =>{
    if(!id) return;

    (async() => {
    const res = await fetch(`/api/products/${id}`)
    const data = await res.json()
    const mapped = {name:data.name, price: String(data.price), isActive:Boolean(data.is_active) }
    setProductInput(mapped)
    console.log("product:", data)
    }) ()
    },[id])


    //form
    const handleSubmit = async() => {
      if(!id) return
      if(isSubmitting) return
      setIsSubmitting(true)
      // await new Promise((r) => setTimeout(r, 1500)); //動作確認用


      try{
      const raw = normalizeNumberString(productInput.price).trim();
      const payload = {
        name: productInput.name,
        price: Number(raw),
        is_active: productInput.isActive,
      }

      const res = await fetch(`/api/products/${id}`,{
        method: "PATCH",
        headers: {"Content-Type" : "application/json"}, 
        body: JSON.stringify(payload),
      })

      if(!res.ok){
        toast.success("更新に失敗しました");
        console.log("update filede",await res.json())
        return
      }
      toast.success("更新しました");
      navigate("/products")
      }finally{
        setIsSubmitting(false)
      }
    }
    

    return(<>
    <h1>商品編集</h1>
    <ProductForm  value={productInput} onChange={setProductInput} onSubmit={handleSubmit} submitLabel="編集を登録する" disabled={isSubmitting}/>
    </>)
}

export default UpdateProductPage;