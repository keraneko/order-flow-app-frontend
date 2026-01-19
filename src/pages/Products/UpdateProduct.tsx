
import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ProductFormValues } from "@/types/Products"
import { normalizeNumberString } from "@/Utils/NumberString";
import ProductForm from "./ProductForm"
import { toast } from "sonner";

const updateProductInput: ProductFormValues  ={
        name: "",
        price: "",
        isActive: true,
        isVisible: true,
    }

function UpdateProductPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const[productInput, setProductInput] = useState<ProductFormValues>(updateProductInput)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() =>{
    if(!id) return;

    (async() => {
    const res = await fetch(`/api/products/${id}`)
    const data = await res.json()
    const mapped = {name:data.name, price: String(data.price), isActive:Boolean(data.is_active), isVisible:Boolean(data.is_visible) }
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
        is_visible: productInput.isVisible,
      }

      const res = await fetch(`/api/products/${id}`,{
        method: "PATCH",
        headers: {
          "Content-Type" : "application/json",
          "Accept": "application/json",
        }, 
        body: JSON.stringify(payload),
      })

      if(!res.ok){
        if(res.status === 422){
          const err = await res.json()
          const firstArray = Object.values(err.errors ?? {})[0] as string[] | undefined;
          const firstMsg = firstArray?.[0] ?? "入力内容を確認してください" 
          toast.error(firstMsg);
          return
        }
        toast.error("更新に失敗しました");
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
    <ProductForm  
      value={productInput} 
      onChange={setProductInput} 
      onSubmit={handleSubmit} 
      submitLabel="編集を登録する" 
      disabled={isSubmitting}
      showIsVisible={true}  
    />
    </>)
}

export default UpdateProductPage;