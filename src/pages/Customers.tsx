import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { useCustomer } from "@/context/customer/useCustomer"
import { useQuery } from "@tanstack/react-query"
import { fetchStores, } from "@/api/Stores"


function Customers() {

    const {updateCustomer,customer} = useCustomer()
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const{name,value} = e.target
        updateCustomer({[name]: value})
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
    queryFn: fetchStores,
  })

  if (isLoading) return <div>読み込み中…</div>
  if (isError) return <div>エラー: {(error as Error).message}</div>
    
    
    return(<>
    <p>お客様情報</p>
    <Label htmlFor="name" className="py-2" >名前</Label>
    <Input name="name" value={customer.name} onChange={handleChange} />
    <Label htmlFor="address" className="py-2">住所</Label>
    <Input name="address" value={customer.address} onChange={handleChange} />
    <Label htmlFor="phone" className="py-2">電話番号</Label>
    <Input name="phone" value={customer.phone} onChange={handleChange} />
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
    <Select value={customer.pickupStoreId ?? ""}  onValueChange = {(value) => updateCustomer({pickupStoreId: value}) } >
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="受取店舗" />
        </SelectTrigger>
        <SelectContent>
            {(data ?? []).map((store)=>
            <SelectItem key={store.id} value={String(store.id)} >{store.name}</SelectItem>)}
        </SelectContent> 
    </Select>
    </div>)}

    {customer.deliveryType === "delivery" && (
    <div>
        <Label className="py-2"  id="deliveryAddress" >配達先住所</Label>
        <Input value={customer.deliveryAddress} onChange = {(e) => updateCustomer({deliveryAddress: e.target.value})}/>
    </div>)}
    <Label className="py-2" id="note" >備考</Label>
    <Textarea onChange = {(e) => updateCustomer({note: e.target.value})} value={customer.note} ></Textarea>

        <Link to="/confirm"><Button className="w-full bg-rose-500 hover:bg-rose-800 text-xl font-medium mt-4 h-15 ">次へ進む</Button></Link>
    </>)
}

export default Customers