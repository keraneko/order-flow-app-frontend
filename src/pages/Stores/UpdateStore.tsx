import { useEffect,useState } from "react"
import { useNavigate,useParams } from "react-router"
import {toast} from "sonner"

import type { StoreFormValue } from "@/types/Stores"

import StoreForm from "./StoreForm" 

 const updateStoreInput: StoreFormValue  ={
    code: "",
    name: "",
    postalCode: "",
    prefecture: "",
    city: "",
    addressLine: "",
    isActive: true

    }


 function UpdateStorePage() {
    const {storeid} = useParams()
    const navigate = useNavigate()
    const [storeInput, setStoreInput] = useState<StoreFormValue>(updateStoreInput)
    const [isSubmitting, setIsSubmitting] = useState(false)

   useEffect(() =>{
       if(!storeid) return;
   
       (async() => {
       const res = await fetch(`/api/stores/${storeid}`)
       const data = await res.json()
       const mapped = {
         code:data.code,
         name: data.name,
         postalCode: data.postal_code,
         prefecture: data.prefecture,
         city: data.city,
         addressLine: data.address_line,
         isActive:Boolean(data.is_active), }
       setStoreInput(mapped)
       console.log("store:", data)
       }) ()
       },[storeid])
  
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

      const res = await fetch(`/api/stores/${storeid}`,{
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
        toast.error("登録に失敗しました");
        return
      }
      toast.success("登録しました");
      navigate("/stores")
      }finally{
        setIsSubmitting(false)
      }
    }


    return(<>
    <h1>店舗編集</h1>
      <StoreForm  value={storeInput} onChange={setStoreInput} onSubmit={handleSubmit} submitLabel="編集を登録する" disabled={isSubmitting} />
    </>)
}

export default UpdateStorePage;