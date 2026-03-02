import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStores } from '@/api/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/cart/useCart';
import { useCustomer } from '@/context/customer/useCustomer';
import { useFulfillment } from '@/context/fulfillment/useFulfillment';

function Customers() {
  //errors
  const { items } = useCart();
  const { fulfillment, updateFulfillment } = useFulfillment();
  const [errors, setErrors] = useState<{
    orderStore?: string;
    name?: string;
    phone?: string;
    pickupStore?: string;
    deliveryAddress?: string;
    deliveryPostalCode?: string;
    items?: string;
  }>({});
  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!customer.name.trim()) nextErrors.name = '名前は必須です';

    if (!customer.phone.trim()) nextErrors.phone = '電話番号は必須です';

    if (fulfillment.deliveryType === 'pickup') {
      if (!fulfillment.pickupStoreId)
        nextErrors.pickupStore = '受取店舗を選択してください';
    }

    if (fulfillment.deliveryType === 'delivery') {
      if (!customer.deliveryAddress)
        nextErrors.deliveryAddress = '配達先住所は必須です';

      if (!customer.deliveryPostalCode)
        nextErrors.deliveryPostalCode = '郵便番号は必須です';
    }

    if (!items || items.length === 0) {
      nextErrors.items = '商品を選択してください';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0; //true
  };
  const navigate = useNavigate();
  const onNext = () => {
    if (!validate()) return;
    void navigate('/confirm');
  };

  const { updateCustomer, customer } = useCustomer();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCustomer({ [name]: value });
    //errors削除
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });

  if (isLoading) return <div>読み込み中…</div>;

  if (isError) return <div>エラー: {error.message}</div>;

  return (
    <>
      {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

      {errors.orderStore && (
        <p className="text-sm text-red-500">{errors.orderStore}</p>
      )}

      <p>お客様情報</p>
      <Label htmlFor="name" className="py-2">
        名前
      </Label>
      <Input name="name" value={customer.name} onChange={handleChange} />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      <Label htmlFor="address" className="py-2">
        住所
      </Label>
      <Input name="address" value={customer.address} onChange={handleChange} />
      <Label htmlFor="phone" className="py-2">
        電話番号
      </Label>
      <Input name="phone" value={customer.phone} onChange={handleChange} />
      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      {/* 郵便番号 */}
      {/* 納品日 */}
      <Label className="py-2">受取方法</Label>

      {fulfillment.deliveryType === 'pickup' && (
        <div className="py-2">
          <Select
            value={
              fulfillment.orderStoreId !== null
                ? String(fulfillment.pickupStoreId)
                : ''
            }
            onValueChange={(value) => {
              updateFulfillment({ pickupStoreId: Number(value) });
              setErrors((prev) => ({ ...prev, pickupStore: undefined }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="受取店舗" />
            </SelectTrigger>
            <SelectContent>
              {(data ?? []).map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pickupStore && (
            <p className="text-sm text-red-500">{errors.pickupStore}</p>
          )}
        </div>
      )}

      {fulfillment.deliveryType === 'delivery' && (
        <div>
          <Label htmlFor="deliveryPostalCode" className="py-2">
            郵便番号
          </Label>
          <Input
            name="deliveryPostalCode"
            value={customer.deliveryPostalCode}
            onChange={handleChange}
          />
          {errors.deliveryPostalCode && (
            <p className="text-sm text-red-500">{errors.deliveryPostalCode}</p>
          )}
          <Label className="py-2" id="deliveryAddress">
            配達先住所
          </Label>
          <Input
            value={customer.deliveryAddress}
            onChange={(e) => {
              updateCustomer({ deliveryAddress: e.target.value });
              setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
            }}
          />
          {errors.deliveryAddress && (
            <p className="text-sm text-red-500">{errors.deliveryAddress}</p>
          )}
        </div>
      )}
      <Label className="py-2" id="note">
        備考
      </Label>
      <Textarea
        onChange={(e) => updateCustomer({ note: e.target.value })}
        value={customer.note}
      ></Textarea>
      <Button
        onClick={onNext}
        className="mt-4 h-15 w-full bg-rose-500 text-xl font-medium hover:bg-rose-800"
      >
        次へ進む
      </Button>

      <></>
    </>
  );
}

export default Customers;
