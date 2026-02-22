import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormDate {
  deliveryDate: string;
  deliveryFrom: string;
  deliveryTo: string;
}

const FormValueDate: FormDate = {
  deliveryDate: '',
  deliveryFrom: '',
  deliveryTo: '',
};

function DeliveryTypeSelector() {
  const [date, setDate] = useState<FormDate>(FormValueDate);
  const updateDate = (data: Partial<FormDate>) => {
    setDate((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateDate({ [name]: value });
  };
  const isDisabled = !(date.deliveryDate && date.deliveryFrom);

  return (
    <>
      <RadioGroup className="mb-5">
        <div className="flex gap-3">
          <RadioGroupItem value="pickup" id="pickup" />
          <Label htmlFor="pickup">店舗受取</Label>
        </div>
        <div className="flex gap-3">
          <RadioGroupItem value="delivery" id="delivery" />
          <Label htmlFor="delivery">配達</Label>
        </div>
      </RadioGroup>

      <Label>日時</Label>
      <div className="flex gap-4">
        <Input type="date" name="deliveryDate" onChange={handleChange} />
        <Input
          name="deliveryFrom"
          type="time"
          step="600"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={handleChange}
        />
        <Input
          name="deliveryTo"
          type="time"
          step="600"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={handleChange}
        />
      </div>
      {/* disabledもつける */}
      <Button disabled={isDisabled} className="mt-10">
        商品選択画面へ進む
      </Button>
    </>
  );
}

export default DeliveryTypeSelector;
