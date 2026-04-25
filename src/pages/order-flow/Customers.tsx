import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { type OrderCustomerInput } from '@/types/customer';

function Customers() {
  const navigate = useNavigate();
  const { customer, updateCustomer } = useCustomer();
  const { fulfillment, updateFulfillment } = useFulfillment();
  const { items } = useCart();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (fulfillment.deliveryType !== 'pickup') return;

    if (fulfillment.pickupStoreId !== null) return;

    if (user?.storeId == null) return;

    updateFulfillment({ pickupStoreId: user.storeId });
  }, [
    fulfillment.deliveryType,
    fulfillment.pickupStoreId,
    user?.storeId,
    updateFulfillment,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderCustomerInput>({
    defaultValues: customer,
    mode: 'onBlur',
  });

  const onValid = (values: OrderCustomerInput) => {
    updateCustomer(values);
    console.log(values);
    void navigate('/order/confirm');
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });

  if (isLoading) return <div>読み込み中…</div>;

  if (isError) return <div>エラー: {error.message}</div>;

  return (
    <>
      <form
        onSubmit={(e) => {
          void handleSubmit(onValid)(e);
        }}
      >
        <p>お客様情報</p>
        <Label htmlFor="name" className="py-2">
          名前
        </Label>
        <Input
          id="name"
          {...register('name', { required: '名前は必須です' })}
        />
        {errors.name && (
          <p className="text-sm text-red-400">{errors.name.message}</p>
        )}

        <Label htmlFor="address" className="py-2">
          住所
        </Label>
        <Input id="address" {...register('address')} />
        <Label htmlFor="phone" className="py-2">
          電話番号
        </Label>
        <Input
          type="tel"
          id="phone"
          {...register('phone', {
            required: '電話番号は必須です',
            validate: (data) => {
              if (!/^\d+$/.test(data)) return '半角数字のみで入力してください';

              if (data.length < 10 || data.length > 11)
                return '10桁~11桁で入力してください';

              return true;
            },
          })}
        />
        {errors.phone && (
          <p className="text-sm text-red-400">{errors.phone.message}</p>
        )}

        <Label className="py-2">受取方法</Label>

        {fulfillment.deliveryType === 'pickup' && (
          <div className="py-2">
            <Select
              value={
                fulfillment.pickupStoreId !== null
                  ? String(fulfillment.pickupStoreId)
                  : ''
              }
              onValueChange={(value) => {
                updateFulfillment({ pickupStoreId: Number(value) });
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
          </div>
        )}
        {fulfillment.deliveryType === 'pickup' &&
          fulfillment.pickupStoreId === null && (
            <span className="text-sm text-red-400">
              受取店舗を選択してください
            </span>
          )}

        {fulfillment.deliveryType === 'delivery' && (
          <div>
            <Label htmlFor="deliveryPostalCode" className="py-2">
              郵便番号
            </Label>
            <Input
              id="deliveryPostalCode"
              {...register('deliveryPostalCode', {
                required:
                  fulfillment.deliveryType === 'delivery'
                    ? '郵便番号は必須です'
                    : false,
                validate: (data) => {
                  if (!data) return true;

                  if (!/^\d+$/.test(data)) return '半角数字で入力してください';

                  if (data.length !== 7) return '数字7桁で入力してください';

                  return true;
                },
              })}
            />
            {errors.deliveryPostalCode && (
              <p className="text-sm text-red-400">
                {errors.deliveryPostalCode.message}
              </p>
            )}
            <Label className="py-2" id="deliveryAddress">
              配達先住所
            </Label>
            <Input
              {...register('deliveryAddress', {
                required:
                  fulfillment.deliveryType === 'delivery'
                    ? '配達先住所は必須です'
                    : false,
                validate: (data) => {
                  if (!data) return true;

                  if (!data.trim()) return '配達先住所を入力してください';

                  return true;
                },
                maxLength: {
                  value: 100,
                  message: '100文字以内で入力してください',
                },
              })}
            />
            {errors.deliveryAddress && (
              <p className="text-sm text-red-400">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>
        )}
        <Label className="py-2" id="note">
          備考
        </Label>
        <Textarea {...register('note')}></Textarea>
        <Button
          type="submit"
          className="mt-4 h-15 w-full bg-rose-500 text-xl font-medium hover:bg-rose-800"
          disabled={items.length === 0}
        >
          次へ進む
        </Button>
      </form>
      <></>
    </>
  );
}

export default Customers;
