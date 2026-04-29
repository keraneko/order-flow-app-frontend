import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFulfillment } from '@/context/fulfillment/useFulfillment';

import { TimeSelect } from './form/TimeSelect';

// DeliveryTypeSelector コンポーネント
function DeliveryTypeSelector() {
  const { fulfillment, updateFulfillment } = useFulfillment();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFulfillment({ [name]: value });
  };

  const handleDeliveryTypeChange = (value: 'pickup' | 'delivery') => {
    if (value === 'pickup') {
      updateFulfillment({ deliveryType: value });
    } else {
      updateFulfillment({ deliveryType: value });
    }
  };

  const isDisabled = !(fulfillment.deliveryDate && fulfillment.deliveryFrom);

  return (
    <>
      <RadioGroup
        value={fulfillment.deliveryType}
        onValueChange={handleDeliveryTypeChange}
        className="my-5"
      >
        <div className="flex gap-3">
          <RadioGroupItem value="pickup" id="pickup" />
          <Label htmlFor="pickup">店舗受取</Label>
        </div>
        <div className="flex gap-3">
          <RadioGroupItem value="delivery" id="delivery" />
          <Label htmlFor="delivery">配達</Label>
        </div>
      </RadioGroup>

      <div className="flex gap-4">
        <div>
          <Label>日時</Label>
          <Input
            value={fulfillment.deliveryDate}
            type="date"
            name="deliveryDate"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>受取時間</Label>
          <TimeSelect
            value={fulfillment.deliveryFrom}
            onChange={(value) => {
              updateFulfillment({ deliveryFrom: value });
            }}
            label="受取時間"
          />
        </div>
        {fulfillment.deliveryType === 'delivery' && (
          <div>
            <Label>配達時間</Label>
            <TimeSelect
              value={fulfillment.deliveryTo}
              onChange={(value) => {
                updateFulfillment({ deliveryTo: value });
              }}
              label="配達時間"
            />
          </div>
        )}
      </div>
      <Button
        onClick={() => void navigate('/order/cart')}
        disabled={isDisabled}
        className="m-10"
      >
        商品選択画面へ進む
      </Button>
    </>
  );
}

export default DeliveryTypeSelector;
