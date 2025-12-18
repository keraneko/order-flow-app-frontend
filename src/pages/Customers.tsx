import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext,useState } from "react"
import { CustomerContext } from "@/context/CustomerContext"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

function Customers() {

    const context = useContext(CustomerContext)
    if(!context) return null

    const {updateCustomer,customer} =context
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const{name,value} = e.target
        updateCustomer({[name]: value})
    }
    const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery" >("pickup")
    const handleDeliveryTypeChange = (value: string) => {
        if(value === "pickup" || value === "delivery"){
            setDeliveryType(value)
        }
    }

    
    
    
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
    <RadioGroup value={deliveryType} onValueChange={handleDeliveryTypeChange} >
        <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup"  />
            <Label htmlFor="pickup">店舗</Label>
        </div>
        <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery">配達</Label>
        </div>
    </RadioGroup>
    {deliveryType === 'pickup' && (<div className="py-2 ">
    <Select>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="受取店舗" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="1">熊本本店</SelectItem>
            <SelectItem value="2">東熊本店</SelectItem>
            <SelectItem value="3">西熊本店</SelectItem>
        </SelectContent> 
    </Select>
    </div>)}
    {deliveryType === "delivery" && (
    <div>
        <Label className="py-2"  id="deliveryAddress" >配達先住所</Label>
        <Input name="deliveryAddress"/>
    </div>)}
    <Label className="py-2" >備考</Label>
    <Textarea></Textarea>

        <Button className="w-full bg-rose-500 hover:bg-rose-800 text-xl font-medium mt-4 h-15 "><Link to="/confirm">次へ進む</Link></Button>
    </>)
}

export default Customers