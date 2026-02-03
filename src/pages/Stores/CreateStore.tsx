import { useState } from "react"
import { useNavigate } from "react-router"
import {toast} from "sonner"
import type { StoreFormValue } from "@/types/Stores"
import { getFirstValidationMessage } from "@/Utils/LaravelValidationError"

import StoreForm from "./StoreForm" 

 const createStoreInput: StoreFormValue  ={
    code: "",
    name: "",
    postalCode: "",
    prefecture: "",
    city: "",
    addressLine: "",
    isActive: true

    }


 function CreateStorePage() {
  const navigate = useNavigate()
   const [storeInput, setStoreInput] = useState<StoreFormValue>(createStoreInput)
   const [isSubmitting, setIsSubmitting] = useState(false)
  
    const handleSubmit = async() => {
      if(isSubmitting) return 
      setIsSubmitting(true)
      try{
        const payload = {
          code: storeInput.code,
          name: storeInput.name,
          postal_code: storeInput.postalCode,
          prefecture: storeInput.prefecture,
          city: storeInput.city,
          address_line: storeInput.addressLine,
          is_active: storeInput.isActive,

        }

      const res = await fetch("/api/stores",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Accept": "application/json",
        }, 
        body: JSON.stringify(payload),
      })

      if(!res.ok){
        if(res.status === 422){
          toast.error(getFirstValidationMessage(res));

          return
        }
        toast.error("登録に失敗しました");

        return
      }
      toast.success("登録しました");
      void navigate("/stores")

      }catch (e) {
        console.error(e);
        toast.error("通信に失敗しました（APIに接続できません）");
      
      }finally{
        setIsSubmitting(false)
      }
    }


    return(<>
    <h1>店舗登録</h1>
      <StoreForm  value={storeInput} onChange={setStoreInput} onSubmit={handleSubmit} submitLabel="登録する" disabled={isSubmitting} />
    </>)
}

export default CreateStorePage;