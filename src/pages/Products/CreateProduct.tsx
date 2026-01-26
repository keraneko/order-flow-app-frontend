import type { ProductFormValues } from "@/types/Products"
import { useState } from "react"
import { useNavigate } from "react-router"
import ProductForm from "./ProductForm"
import { normalizeNumberString } from "@/Utils/NumberString"
import {toast} from "sonner"

 const createProductInput: ProductFormValues  ={
        name: "",
        price: "",
        image: null,
        imageFile: null,
        isActive: true,
        isVisible: true,
    }


 function CreateProductPage() {
  const navigate = useNavigate()
   const [productInput, setProductInput] = useState<ProductFormValues>(createProductInput)
   const [isSubmitting, setIsSubmitting] = useState(false)
  
    const handleSubmit = async() => {
      if(isSubmitting) return 
      setIsSubmitting(true)
      try{
      const raw = normalizeNumberString(productInput.price).trim();
      const num = Number(raw)

      //Form Data
      const formData = new FormData();
        formData.append('name', productInput.name)
        formData.append('price', String(num))
        formData.append('is_active', productInput.isActive ? '1' : '0' )
        formData.append('is_visible', productInput.isVisible ? '1' : '0' )
        if(productInput.imageFile){
          formData.append('image', productInput.imageFile)
        }
    
    const res = await fetch("/api/products",{
        method: "POST",
        headers: {Accept: "application/json",}, 
        body: formData,
      })
      if(!res.ok){
        if(res.status === 422){
          const err = await res.json()
          const firstArray = Object.values(err.errors ?? {})[0] as string[] | undefined;
          const firstMsg = firstArray?.[0] ?? "入力内容を確認してください" 
          toast.error(firstMsg);
          return
        }
        toast.error("登録に失敗しました");
        return
      }
      toast.success("登録しました");
      navigate("/products")
      }finally{
        setIsSubmitting(false)
      }
    }


    return(<>
    <h1>商品登録</h1>
      <ProductForm  value={productInput} onChange={setProductInput} onSubmit={handleSubmit} submitLabel="登録する" disabled={isSubmitting} />
    </>)
}

export default CreateProductPage;