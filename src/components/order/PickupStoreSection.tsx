import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getStores } from '@/api/stores';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { OrderShow } from '@/types/order';
import type { PickupStoreUpdate, Store } from '@/types/store';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

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
  console.log(selectedPickupStoreId);

  const handleSubmit = async () => {
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
      const res = await fetch(`/api/orders/${orderId}/destination`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(getFirstValidationMessage(res));
        }

        return;
      }
      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setIsEditing(false);
      setDraftPickupStore(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '更新に失敗しました';
      toast.error(message);
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
    queryKey: ['orderStoresUpdate'],
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
