import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { OrderShow } from '@/types/order';
import { formatTime } from '@/utils/formatTime';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

interface FulfillmentInfoCardProps {
  order: OrderShow;
  orderId: number;
}

interface FulfillmentTypeEdit {
  deliveryDate?: string;
  deliveryFrom?: string;
  deliveryTo?: string;
}

export default function FulfillmentInfoCard({
  order,
  orderId,
}: FulfillmentInfoCardProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSchedule, setDraftSchedule] =
    useState<FulfillmentTypeEdit | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraftSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const buildPayload = () => {
      if (order.deliveryType === 'pickup') {
        const pickupPayload = {
          delivery_date: draftSchedule?.deliveryDate ?? order.deliveryDate,
          delivery_from: draftSchedule?.deliveryFrom ?? order.deliveryFrom,
        };

        return pickupPayload;
      }

      if (order.deliveryType === 'delivery') {
        const deliveryPayload = {
          delivery_date: draftSchedule?.deliveryDate ?? order.deliveryDate,
          delivery_from: draftSchedule?.deliveryFrom ?? order.deliveryFrom,
          delivery_to: draftSchedule?.deliveryTo ?? order.deliveryTo,
        };

        return deliveryPayload;
      }
    };

    try {
      const res = await fetch(`/api/orders/${orderId}/schedule`, {
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
    } catch (e) {
      const message = e instanceof Error ? e.message : '更新に失敗しました';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          void handleSubmit();
        }}
      >
        <div className="mt-5 rounded-sm border">
          <div className="flex h-10 justify-between border-b px-4">
            <Label className="font-semibold">配送情報</Label>
            {!isEditing && (
              <button type="button" onClick={() => setIsEditing(true)}>
                <p className="border-b text-xs text-violet-600">編集</p>
              </button>
            )}
            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <button disabled={isSubmitting} type="submit">
                  <Badge variant="outline">保存</Badge>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDraftSchedule(null);
                  }}
                >
                  <Badge variant="destructive">中止</Badge>
                </button>
              </div>
            )}
          </div>

          <div className="flex px-2 py-1">
            <Label className="pr-4 text-gray-500">納品日:</Label>
            <Input
              disabled={!isEditing}
              value={draftSchedule?.deliveryDate ?? order.deliveryDate}
              type="date"
              name="deliveryDate"
              onChange={handleChange}
            />
          </div>

          {order.deliveryType === 'delivery' && (
            <div>
              <div className="flex px-2 py-1">
                <Label className="pr-4 text-gray-500">納品時間:</Label>
                <Label className="text-base">
                  <Input
                    disabled={!isEditing}
                    type="time"
                    name="deliveryFrom"
                    value={
                      draftSchedule?.deliveryFrom ??
                      formatTime(order.deliveryFrom)
                    }
                    onChange={handleChange}
                  />
                  〜
                  <Input
                    disabled={!isEditing}
                    type="time"
                    name="deliveryTo"
                    value={
                      draftSchedule?.deliveryTo ?? formatTime(order.deliveryTo)
                    }
                    onChange={handleChange}
                  />
                </Label>
              </div>
              <div className="flex items-start p-2">
                <div>
                  <Label className="py-1 text-gray-500">配送先住所:</Label>
                  <Label className="py-1">〒 {order.deliveryPostalCode}</Label>
                  <Label className="py-1 text-sm">
                    {order.deliveryAddress}
                  </Label>
                </div>
              </div>
            </div>
          )}
          {order.deliveryType === 'pickup' && order.pickupStore === null && (
            <Label className="ml-4 p-2 text-sm text-red-400">
              店舗情報を取得できませんでした
            </Label>
          )}
          {order.deliveryType === 'pickup' && order.pickupStore !== null && (
            <div>
              <div className="ml-4 flex px-2 py-1">
                <Label className="pr-4 text-gray-500">納品時間:</Label>
                <Label className="text-base">
                  <Input
                    disabled={!isEditing}
                    type="time"
                    name="deliveryFrom"
                    value={
                      draftSchedule?.deliveryFrom ??
                      formatTime(order.deliveryFrom)
                    }
                    onChange={handleChange}
                  />
                </Label>
              </div>
              <div className="ml-4 flex px-2 py-1">
                <Label className="pr-4 text-gray-500">受取店舗:</Label>
                <Label className="text-base">{order.pickupStore.name}</Label>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
