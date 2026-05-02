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
    <div className="mx-auto max-w-lg py-6">
      <h2 className="mb-6 text-lg font-bold">お客様情報</h2>

      <form
        onSubmit={(e) => {
          void handleSubmit(onValid)(e);
        }}
        className="flex flex-col gap-5"
      >
        {/* 名前 */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">
            名前 <span className="text-xs text-red-400">*必須</span>
          </Label>
          <Input
            id="name"
            className="rounded-xl"
            placeholder="山田 太郎"
            {...register('name', { required: '名前は必須です' })}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* 住所 */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">住所</Label>
          <Input
            id="address"
            className="rounded-xl"
            placeholder="熊本県熊本市〇〇"
            {...register('address')}
          />
        </div>

        {/* 電話番号 */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">
            電話番号 <span className="text-xs text-red-400">*必須</span>
          </Label>
          <Input
            type="tel"
            id="phone"
            className="rounded-xl"
            placeholder="09012345678"
            {...register('phone', {
              required: '電話番号は必須です',
              validate: (data) => {
                if (!/^\d+$/.test(data))
                  return '半角数字のみで入力してください';

                if (data.length < 10 || data.length > 11)
                  return '10桁~11桁で入力してください';

                return true;
              },
            })}
          />
          {errors.phone && (
            <p className="text-xs text-red-400">{errors.phone.message}</p>
          )}
        </div>

        {/* 受取方法 */}
        <div className="flex flex-col gap-1.5">
          <Label>受取方法</Label>

          {fulfillment.deliveryType === 'pickup' && (
            <>
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
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="受取店舗を選択" />
                </SelectTrigger>
                <SelectContent>
                  {(data ?? []).map((store) => (
                    <SelectItem key={store.id} value={String(store.id)}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fulfillment.pickupStoreId === null && (
                <p className="text-xs text-red-400">
                  受取店舗を選択してください
                </p>
              )}
            </>
          )}

          {fulfillment.deliveryType === 'delivery' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deliveryPostalCode">郵便番号</Label>
                <Input
                  id="deliveryPostalCode"
                  className="rounded-xl"
                  placeholder="8600001"
                  {...register('deliveryPostalCode', {
                    required:
                      fulfillment.deliveryType === 'delivery'
                        ? '郵便番号は必須です'
                        : false,
                    validate: (data) => {
                      if (!data) return true;

                      if (!/^\d+$/.test(data))
                        return '半角数字で入力してください';

                      if (data.length !== 7) return '数字7桁で入力してください';

                      return true;
                    },
                  })}
                />
                {errors.deliveryPostalCode && (
                  <p className="text-xs text-red-400">
                    {errors.deliveryPostalCode.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deliveryAddress">配達先住所</Label>
                <Input
                  id="deliveryAddress"
                  className="rounded-xl"
                  placeholder="熊本県熊本市〇〇 1-2-3"
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
                  <p className="text-xs text-red-400">
                    {errors.deliveryAddress.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 備考 */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note">備考</Label>
          <Textarea
            id="note"
            className="rounded-xl"
            placeholder="アレルギーや要望があればご記入ください"
            {...register('note')}
          />
        </div>

        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl bg-amber-700 text-base font-medium hover:bg-amber-800 disabled:bg-gray-300"
          disabled={items.length === 0}
        >
          次へ進む →
        </Button>
      </form>
    </div>
  );
}

export default Customers;
