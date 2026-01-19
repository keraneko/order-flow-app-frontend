import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductFormValues } from "@/types/Products";
import { normalizeNumberString } from "@/Utils/NumberString";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

type ProductFormProps = {
        value: ProductFormValues;
        onChange: (next:ProductFormValues) =>void;
        onSubmit: ()=>void | Promise<void>;
        submitLabel: string;
        disabled?: boolean;
        showIsVisible?:boolean;
    }

function ProductForm({value, onChange, onSubmit, submitLabel, disabled, showIsVisible}: ProductFormProps) {
    //errors
    const [errors, setErrors] = useState<{name?:string; price?:string; }>({})
    const validate = () => {
        const nextErrors: typeof errors = {};
        if(!value.name) nextErrors.name = "商品名を入力してください"
        if(!value.price){ nextErrors.price = "価格を入力してください"
         }else{
            const row  = normalizeNumberString(value.price).trim()
            if (!row) nextErrors.price = "価格を入力してください";
            else{
                const n = Number(row)
                if(Number.isNaN(n)){nextErrors.price = "価格は数字で入力してください"}
                else if(n<1) nextErrors.price = "価格は１以上にしてください"
                }
            } 

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
            
    }
    

    return(<>
    <form onSubmit={(e) =>{
        e.preventDefault(); 
        if(!validate()) 
        return; onSubmit() }}>

        <Label htmlFor="name" className="py-2" >商品名</Label>
        <Input name="name" 
        value={value.name}
        onChange={(e) => {
            onChange({...value, name: e.target.value});
            setErrors((prev) => ({...prev, name: undefined}));
        }} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <Label htmlFor="price" className="py-2">価格</Label>
        <Input name="price"
        value={value.price}
        onChange={(e) => {
            onChange({...value, price: e.target.value});
            setErrors((prev) => ({...prev, price: undefined}));
        }} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

        {/* isActive */}
        <div className="flex items-center gap-3">
            <Checkbox  id="isActive"
            checked={!value.isActive}
            onCheckedChange={(checked: CheckedState) => {
                const isStopped = checked === true
                onChange({...value, isActive: !isStopped})
            }}/>
            <Label htmlFor="isActive" className="py-2">SOLD OUT"として登録する</Label>
        </div>

        {/* isVisible   */}
        {showIsVisible &&
         <div className="flex items-center gap-3">
            <Checkbox  id="isVisible"
            checked={!value.isVisible}
            onCheckedChange={(checked: CheckedState) => {
                const isStopped = checked === true
                onChange({...value, isVisible: !isStopped})
            }}/>
            <Label htmlFor="isVisible" className="py-2">非表示にする</Label>
        </div>}

        <Button type="submit" disabled={disabled} >{submitLabel}</Button>


    </form>
    
    </>)

}

export default ProductForm