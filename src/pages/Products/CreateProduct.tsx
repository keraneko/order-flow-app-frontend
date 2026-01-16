import type { CreateProductInput } from "@/types/Products"
import { useState } from "react"
import { useNavigate } from "react-router"
import ProductForm from "./ProductForm"
import { normalizeNumberString } from "@/Utils/NumberString"
import {toast} from "sonner"

 const createProductInput: CreateProductInput  ={
        name: "",
        price: "",
        isActive: true,
    }


 function CreateProductPage() {
  const navigate = useNavigate()
   const [productInput, setProductInput] = useState<CreateProductInput>(createProductInput)
   const [isSubmitting, setIsSubmitting] = useState(false)
  //  const updateProductInput = (data: Partial<CreateProductInput>) => {
  //         setProductInput((prev)=>({
  //           ...prev,
  //           ...data,
  //         }))
  //      }

  //  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  //       const{name,value} = e.target
  //       updateProductInput({[name]: value})
  //   }
    
    // const handleCheckedChange = (checked: boolean | "indeterminate") => {
    //   const isStopped = checked === true;
    //   updateProductInput({isActive: !isStopped})
    // }

    const handleSubmit = async() => {
      if(isSubmitting) return 
      setIsSubmitting(true)
      try{
      const raw = normalizeNumberString(productInput.price).trim();
      const payload = {
        name: productInput.name,
        price: Number(raw),
        is_active: productInput.isActive,
      }

    const res = await fetch("/api/products",{
        method: "POST",
        headers: {"Content-Type" : "application/json"}, 
        body: JSON.stringify(payload),
      })
      if(!res.ok){
        toast.error("登録に失敗しました");
        console.log("create filede",await res.json())
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