import { useQuery } from "@tanstack/react-query"
import {useState} from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/cart/useCart"
import { useCustomer } from "@/context/customer/useCustomer"
import { getStore } from "@/types/Stores"


function Customers() {
    //errors
    const {items} = useCart()
    const [errors, setErrors] = useState<{orderStore?:string; name?:string; phone?:string; pickupStore?:string; deliveryAddress?:string; items?:string}>({});
    const validate = () => {
        const nextErrors: typeof errors = {}; 
        if (!customer.orderStoreId) nextErrors.orderStore = "受注店舗を選択してください"
        if (!customer.name.trim()) nextErrors.name = "名前は必須です" 
        if (!customer.phone.trim()) nextErrors.phone = "電話番号は必須です"
        if (customer.deliveryType === 'pickup') {
            if(!customer.pickupStoreId) nextErrors.pickupStore = "受取店舗を選択してください"
        }
        if(customer.deliveryType === 'delivery') {
            if(!customer.deliveryAddress) nextErrors.deliveryAddress = "配達先住所は必須です"
        }
        
        if(!items || items.length === 0 ) {nextErrors.items = "商品を選択してください"}
        
        setErrors(nextErrors);
         return Object.keys(nextErrors).length === 0; //true
    }
    const navigate = useNavigate()
    const onNext = () =>{
        if(!validate()) return
        navigate("/confirm")
    }



    const {updateCustomer,customer} = useCustomer()
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const{name,value} = e.target
        updateCustomer({[name]: value})
        //errors削除
        setErrors(prev => ({ ...prev, [name]: undefined }))

    }
   const handleDeliveryTypeChange = (value: "pickup" | "delivery") => {
        if(value === "pickup"){
            updateCustomer({deliveryType: value,deliveryAddress: ""})
        }else{
            updateCustomer({deliveryType: value,pickupStoreId: ""})
        }
    }

    const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stores"],
    queryFn: getStore,
  })

  if (isLoading) return <div>読み込み中…</div>
  if (isError) return <div>エラー: {(error as Error).message}</div>
    
    
    return(<>
    {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}
    <p>受注店舗</p>
    <Select value={customer.orderStoreId ?? ""}
      onValueChange = {(value) =>{
        updateCustomer({orderStoreId: value}) 
        setErrors(prev =>({...prev, orderStore: undefined}))
        }} >
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="受注店舗" />
        </SelectTrigger>
        <SelectContent>
            {(data ?? []).map((store)=>
            <SelectItem key={store.id} value={String(store.id)} >{store.name}</SelectItem>)}
        </SelectContent> 
    </Select>
    {errors.orderStore && <p className="text-red-500 text-sm">{errors.orderStore}</p>}

    <p>お客様情報</p>
    <Label htmlFor="name" className="py-2" >名前</Label>
    <Input name="name" value={customer.name} onChange={handleChange} />
    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

    <Label htmlFor="address" className="py-2">住所</Label>
    <Input name="address" value={customer.address} onChange={handleChange} />
    <Label htmlFor="phone" className="py-2">電話番号</Label>
    <Input name="phone" value={customer.phone} onChange={handleChange} />
    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
    {/* 郵便番号 */}
    {/* 納品日 */}
    <Label className="py-2" >受取方法</Label>
    <RadioGroup value={customer.deliveryType} onValueChange={handleDeliveryTypeChange} >
        <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup"  />
            <Label htmlFor="pickup">店舗</Label>
        </div>
        <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery">配達</Label>
        </div>
    </RadioGroup>

    {customer.deliveryType === 'pickup' && (<div className="py-2 ">
    <Select value={customer.pickupStoreId ?? ""}  
        onValueChange = {(value) => {
        updateCustomer({pickupStoreId: value})
        setErrors(prev => ({ ...prev, pickupStore: undefined }))
 }} >
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="受取店舗" />
        </SelectTrigger>
        <SelectContent>
            {(data ?? []).map((store)=>
            <SelectItem key={store.id} value={String(store.id)} >{store.name}</SelectItem>)}
        </SelectContent> 
    </Select>
    {errors.pickupStore && <p className="text-red-500 text-sm">{errors.pickupStore}</p>}
    </div>)}

    {customer.deliveryType === "delivery" && (
    <div>
        <Label className="py-2"  id="deliveryAddress" >配達先住所</Label>
        <Input value={customer.deliveryAddress}
         onChange = {(e) => {
            updateCustomer({deliveryAddress: e.target.value})
            setErrors(prev => ({...prev, deliveryAddress: undefined}))
            }}/>
        {errors.deliveryAddress && <p className="text-red-500 text-sm">{errors.deliveryAddress}</p>}
    </div>)}
    <Label className="py-2" id="note" >備考</Label>
    <Textarea onChange = {(e) => updateCustomer({note: e.target.value})} value={customer.note} ></Textarea>    
    <Button onClick = {onNext} className="w-full bg-rose-500 hover:bg-rose-800 text-xl font-medium mt-4 h-15 ">次へ進む</Button>
        
        <></>
    </>)
}

export default Customers