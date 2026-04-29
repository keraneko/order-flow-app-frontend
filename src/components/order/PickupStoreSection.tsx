import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { getStores } from '@/api/stores';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/axios';
import type { OrderShow } from '@/types/order';
import type { PickupStoreUpdate, Store } from '@/types/store';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';

interface PickupStoreSectionProps {
  order: OrderShow;
  orderId: number;
}

export default function PickupStoreSection({
  order,
  orderId,
}: PickupStoreSectionProps) {
  const queryClient = useQueryClient();
  const [draftPickupStore, setDraftPickupStore] =
    useState<PickupStoreUpdate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPickupStoreId =
    draftPickupStore?.pickupStoreId ?? order.pickupStore?.id;
  const handleChange = (value: string) => {
    setDraftPickupStore({
      pickupStoreId: Number(value),
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const buildPayload = () => {
      if (order.deliveryType === 'pickup') {
        const pickupPayload = {
          pickup_store_id:
            draftPickupStore?.pickupStoreId ?? order.pickupStore?.id,
        };

        return pickupPayload;
      }
    };

    try {
      await apiClient.patch(
        `/api/orders/${orderId}/destination`,
        buildPayload(),
      );

      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setIsEditing(false);
      setDraftPickupStore(null);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 403) {
          return toast.error(
            '現在のユーザーでこの注文を更新する権限がありません',
          );
        }

        if (status === 422) {
          return toast.error(
            getFirstAxiosValidationMessage(e.response?.data) ??
              '入力内容が間違っています',
          );
        }

        return toast.error('更新に失敗しました');
      }
      toast.error('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    data: stores,
    isPending,
    isError,
    error,
  } = useQuery<Store[]>({
    queryKey: ['pickupStoreUpdate'],
    queryFn: getStores,
  });

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!stores) return <span>データがありません</span>;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="flex-1 text-right">
          {/* 編集ボタン */}
          <div className="pr-4 text-right">
            {!isEditing && (
              <button type="button" onClick={() => setIsEditing(true)}>
                <Badge variant="outline">編集</Badge>
              </button>
            )}
            {isEditing && (
              <div className="flex justify-end">
                <button className="mr-2" disabled={isSubmitting} type="submit">
                  <Badge variant="outline">保存</Badge>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDraftPickupStore(null);
                  }}
                >
                  <Badge variant="destructive">中止</Badge>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="px-2 py-1">
          <Label className="pr-4 text-xs text-gray-500">受取店舗:</Label>
          <select
            disabled={!isEditing}
            className="w-full rounded-md border p-2"
            value={
              selectedPickupStoreId !== undefined
                ? String(selectedPickupStoreId)
                : ''
            }
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="">選択してください</option>
            {stores.map((store) => (
              <option key={store.id} value={String(store.id)}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </>
  );
}
