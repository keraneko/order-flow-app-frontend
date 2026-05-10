import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { getOrder } from '@/api/orders';
import { getActiveStores } from '@/api/stores';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/axios';
import { type OrderShow } from '@/types/order';
import type { PickupStoreUpdate, Store } from '@/types/store';
import {
  getAxiosMessage,
  getFirstAxiosValidationMessage,
} from '@/utils/apiError';

export default function OrderDeliveryTypeEditPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const enabled = Number.isFinite(orderId) && orderId > 0;

  const {
    data: order,
    isPending: isOrderPending,
    isError: isOrderError,
    error: orderError,
  } = useQuery<OrderShow>({
    queryKey: ['orders', orderId],
    enabled,
    queryFn: () => getOrder(orderId),
  });

  const {
    data: stores,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
  } = useQuery<Store[]>({
    queryKey: ['orderStores'],
    queryFn: getActiveStores,
  });

  //order
  if (isOrderPending) return <span>読み込み中...</span>;

  if (isOrderError) return <span>エラーコード: {orderError.message}</span>;

  if (!order) return <span>データがありません</span>;

  //store
  if (isStorePending) return <span>読み込み中...</span>;

  if (isStoreError) return <span>エラーコード: {storeError.message}</span>;

  if (!stores) return <span>データがありません</span>;

  return (
    <>
      <OrderDeliveryTypeEditer
        order={order}
        orderId={orderId}
        stores={stores}
      />
    </>
  );
}

interface OrderDeliveryTypeEditerProps {
  order: OrderShow;
  orderId: number;
  stores: Store[];
}

interface DeliveryAddressForm {
  deliveryPostalCode?: string;
  deliveryAddress?: string;
}

function OrderDeliveryTypeEditer({
  order,
  orderId,
  stores,
}: OrderDeliveryTypeEditerProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [draftPickupStoreId, setDraftPickupStoreId] =
    useState<PickupStoreUpdate | null>(null);
  const [draftDeliveryAddress, setDraftDeliveryAddress] =
    useState<DeliveryAddressForm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputDeliveryAddress =
    draftDeliveryAddress?.deliveryAddress ?? order.deliveryAddress;

  const inputDeliveryPostalCode =
    draftDeliveryAddress?.deliveryPostalCode ?? order.deliveryPostalCode;

  const selectedPickupStoreId =
    draftPickupStoreId?.pickupStoreId ?? order.pickupStore?.id;

  const dialogDescription =
    order.deliveryType === 'delivery'
      ? '受取方法を店舗受取に変更すると、現在の配達先情報は削除されます。保存してよろしいですか？'
      : '受取方法を配達に変更すると、現在の受取店舗情報は削除されます。保存してよろしいですか？';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraftDeliveryAddress((prev) => ({
      ...(prev ?? {}),
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    if (value === '') {
      setDraftPickupStoreId(null);

      return;
    }

    setDraftPickupStoreId({
      pickupStoreId: Number(value),
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const buildPayload = () => {
      if (order.deliveryType === 'pickup') {
        const payload = {
          delivery_type: 'delivery',
          delivery_postal_code: inputDeliveryPostalCode,
          delivery_address: inputDeliveryAddress,
        };

        return payload;
      }

      if (order.deliveryType === 'delivery') {
        const payload = {
          delivery_type: 'pickup',
          pickup_store_id: selectedPickupStoreId,
        };

        return payload;
      }
    };

    try {
      await apiClient.patch(
        `/api/orders/${orderId}/deliveryType`,
        buildPayload(),
      );

      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setDraftDeliveryAddress(null);
      setDraftPickupStoreId(null);
      void navigate(`/orders/${orderId}`);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const validationMessage = getFirstAxiosValidationMessage(
          e.response?.data,
        );
        const apiMessage = getAxiosMessage(e.response?.data);

        if (status === 403) {
          toast.error('現在のユーザーでこの注文を更新する権限がありません');

          return;
        }

        if (status === 422) {
          toast.error(
            validationMessage ?? apiMessage ?? '入力内容が間違っています',
          );

          return;
        }

        toast.error('更新に失敗しました');

        return;
      }
      toast.error('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* ページタイトル */}
        <h2 className="mb-6 text-lg font-bold">受け渡し方法の変更する</h2>
        <p></p>
        {/* 来店受取のとき: 店舗選択 */}
        {order.deliveryType === 'delivery' && (
          <div className="mb-6">
            <Label className="text-muted-foreground mb-2 block text-sm">
              受取店舗
            </Label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-base"
              onChange={(e) => handleSelectChange(e.target.value)}
              value={
                selectedPickupStoreId !== undefined
                  ? String(selectedPickupStoreId)
                  : ''
              }
            >
              <option value="">選択してください</option>
              {stores.map((store) => (
                <option key={store.id} value={String(store.id)}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* 配送のとき: 住所入力 */}
        {order.deliveryType === 'pickup' && (
          <div className="mb-6 space-y-4">
            <div>
              <Label className="text-muted-foreground mb-2 block text-sm">
                郵便番号
              </Label>
              <Input
                value={
                  inputDeliveryPostalCode !== undefined
                    ? inputDeliveryPostalCode
                    : ''
                }
                placeholder="000-0000"
                className="rounded-xl"
                onChange={handleChange}
                name="deliveryPostalCode"
              />
            </div>
            <div>
              <Label className="text-muted-foreground mb-2 block text-sm">
                住所
              </Label>
              <Input
                value={
                  inputDeliveryAddress !== undefined ? inputDeliveryAddress : ''
                }
                placeholder="都道府県・市区町村・番地"
                className="rounded-xl"
                onChange={handleChange}
                name="deliveryAddress"
              />
            </div>
          </div>
        )}
        {/* ボタン */}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              disabled={isSubmitting}
              className="mb-3 w-full rounded-xl bg-amber-700 hover:bg-amber-800"
            >
              {isSubmitting ? '保存中...' : '保存する'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>データを更新します</AlertDialogTitle>

              <AlertDialogDescription>
                {dialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  void handleSubmit();
                }}
              >
                変更を保存する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="outline"
          type="button"
          className="w-full rounded-xl"
          onClick={() => void navigate(-1)}
        >
          キャンセル
        </Button>
      </div>
    </>
  );
}
