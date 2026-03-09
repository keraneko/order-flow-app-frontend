import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStores } from '@/api/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFulfillment } from '@/context/fulfillment/useFulfillment';
import type { Store } from '@/types/store';

// TimeStampコンポーネント

const buildTimeOptions = (): string[] => {
  const startMinutes = 8 * 60; //営業開始時間
  const endMinutes = 20 * 60; //営業終了時間
  const options: string[] = [];

  for (let t = startMinutes; t <= endMinutes; t += 10) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;

    const label = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    options.push(label);
  }

  return options;
};
interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

function TimeSelect({ value, onChange, label, disabled }: TimeSelectProps) {
  const timeOptions = buildTimeOptions();

  return (
    <>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="選択して下さい" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

// useQuery(stores) コンポーネント
function OrderStoreId() {
  const { fulfillment, updateFulfillment } = useFulfillment();

  const {
    data: stores,
    isPending,
    isError,
    error,
  } = useQuery<Store[]>({
    queryKey: ['orderStores'],
    queryFn: getStores,
  });

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!stores) return <span>データがありません</span>;

  return (
    <>
      <Select
        value={
          fulfillment.orderStoreId !== null
            ? String(fulfillment.orderStoreId)
            : ''
        }
        onValueChange={(value) => {
          updateFulfillment({ orderStoreId: Number(value) });
        }}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="店舗を選択してください" />
        </SelectTrigger>
        <SelectContent className="max-h-64 overflow-y-auto">
          <SelectGroup>
            <SelectLabel>受注店舗</SelectLabel>
            {stores.map((store) => (
              <SelectItem key={store.id} value={String(store.id)}>
                {store.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

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
  const isOrderStoreUnselected = fulfillment.orderStoreId === null;

  return (
    <>
      <OrderStoreId />
      <RadioGroup
        disabled={isOrderStoreUnselected}
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
            disabled={isOrderStoreUnselected}
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
            disabled={isOrderStoreUnselected}
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
              disabled={isOrderStoreUnselected}
            />
          </div>
        )}
      </div>
      <Button
        onClick={() => void navigate('/order/cart')}
        disabled={isDisabled || isOrderStoreUnselected}
        className="m-10"
      >
        商品選択画面へ進む
      </Button>
    </>
  );
}

export default DeliveryTypeSelector;
