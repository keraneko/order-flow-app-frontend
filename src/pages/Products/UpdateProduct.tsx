
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import type { CreateProductInput } from "@/types/Products"
import { Button } from "@/components/ui/button"

const createProductInput: CreateProductInput  ={
        name: "",
        price: "",
        isActive: true,
    }

function UpdateProductPage() {
    const {id} = useParams()
        const navigate = useNavigate()

    
    const[productInput, setProductInput] = useState<CreateProductInput>(createProductInput)
    const updateProductInput = (data: Partial<CreateProductInput>) => {
            setProductInput((prev)=>({
            ...prev,
            ...data,
            }))
        }

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

     const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const{name,value} = e.target
        updateProductInput({[name]: value})
    }

    const handleCheckedChange = (checked: boolean | "indeterminate") => {
      const isStopped = checked === true;
      updateProductInput({isActive: !isStopped})
    }

    const toHalfWidthNumberString = (priceInput: string) => {
      return priceInput.replace(/[０-９]/g, (change) => String.fromCharCode(change.charCodeAt(0) - 0xFEE0));
    }

    const handleSubmit = async() => {
        if(!id) return
      const raw = toHalfWidthNumberString(productInput.price).trim();
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
        console.log("create filede",await res.json())
        return
      }
      alert("更新しました")
      navigate("/products")
    }
    

    return(<>
    <h1>商品登録</h1>
    <Label htmlFor="name" className="py-2" >商品名</Label>
    <Input name="name" value={productInput.name} onChange={handleChange}/>

    <Label htmlFor="price" className="py-2">価格</Label>
    <Input name="price" value={productInput.price} onChange={handleChange} />

    <div className="flex items-center gap-3">
    <Checkbox  id="isActive"
    checked={!productInput.isActive}
    onCheckedChange={handleCheckedChange}

      />
    <Label htmlFor="isActive" className="py-2">"SOLD OUT"として登録する</Label>
    </div>
    <Button onClick={handleSubmit} >登録する</Button>
    </>)
}

export default UpdateProductPage;