import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { OrderShow } from '@/types/order';
import { formatTime } from '@/utils/formatTime';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

interface ScheduleSectionProps {
  order: OrderShow;
  orderId: number;
}

interface DraftSchedule {
  deliveryDate?: string;
  deliveryFrom?: string;
  deliveryTo?: string;
}

export function ScheduleSection({ order, orderId }: ScheduleSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState<DraftSchedule | null>(
    null,
  );

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
      setDraftSchedule(null);
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
        <div className="border-b">
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
                    setDraftSchedule(null);
                  }}
                >
                  <Badge variant="destructive">中止</Badge>
                </button>
              </div>
            )}
          </div>
          <div>
            <div className="flex px-2 py-1">
              <Label className="pr-4 text-gray-500">納品日:</Label>
              <Input
                className="flex-1"
                disabled={!isEditing}
                value={draftSchedule?.deliveryDate ?? order.deliveryDate}
                type="date"
                name="deliveryDate"
                onChange={handleChange}
              />
            </div>

            {/* deliveryの時のUI */}

            <div>
              <div className="flex px-2 py-1">
                <Label className="pr-4 text-gray-500">納品時間:</Label>
                <div className="text-base">
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
                  {order.deliveryType === 'delivery' && <span>~</span>}
                  {order.deliveryType === 'delivery' && (
                    <Input
                      disabled={!isEditing}
                      type="time"
                      name="deliveryTo"
                      value={
                        draftSchedule?.deliveryTo ??
                        formatTime(order.deliveryTo)
                      }
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
