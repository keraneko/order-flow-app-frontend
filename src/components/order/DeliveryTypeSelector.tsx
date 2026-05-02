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
    <div className="mx-auto max-w-lg py-6">
      <h2 className="mb-6 text-lg font-bold">受取方法・日時の選択</h2>

      {/* 受取方法 */}
      <div className="mb-6 flex flex-col gap-1.5">
        <Label>受取方法</Label>
        <RadioGroup
          value={fulfillment.deliveryType}
          onValueChange={handleDeliveryTypeChange}
          className="mt-1 flex flex-col gap-2"
        >
          <label
            htmlFor="pickup"
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              fulfillment.deliveryType === 'pickup'
                ? 'border-amber-700 bg-amber-50'
                : 'border-gray-200'
            }`}
          >
            <RadioGroupItem value="pickup" id="pickup" />
            店舗受取
          </label>

          <label
            htmlFor="delivery"
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              fulfillment.deliveryType === 'delivery'
                ? 'border-amber-700 bg-amber-50'
                : 'border-gray-200'
            }`}
          >
            <RadioGroupItem value="delivery" id="delivery" />
            配達
          </label>
        </RadioGroup>
      </div>

      {/* 日時・時間 */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>日付</Label>
          <Input
            type="date"
            name="deliveryDate"
            value={fulfillment.deliveryDate}
            onChange={handleChange}
            className="rounded-xl"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label>受取時間</Label>
            <TimeSelect
              value={fulfillment.deliveryFrom}
              onChange={(value) => updateFulfillment({ deliveryFrom: value })}
              label="受取時間"
            />
          </div>

          {fulfillment.deliveryType === 'delivery' && (
            <div className="flex flex-1 flex-col gap-1.5">
              <Label>配達時間</Label>
              <TimeSelect
                value={fulfillment.deliveryTo}
                onChange={(value) => updateFulfillment({ deliveryTo: value })}
                label="配達時間"
              />
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={() => void navigate('/order/products')}
        disabled={isDisabled}
        className="h-12 w-full rounded-xl bg-amber-700 text-base font-medium hover:bg-amber-800 disabled:bg-gray-300"
      >
        商品選択へ進む →
      </Button>
    </div>
  );
}

export default DeliveryTypeSelector;
