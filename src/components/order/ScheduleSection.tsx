import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/axios';
import type { OrderShow } from '@/types/order';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';
import { getTodayDateInputValue } from '@/utils/date';
import { formatTime } from '@/utils/formatTime';

import { TimeSelect } from './form/TimeSelect';

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
    setDraftSchedule((prev) => ({ ...(prev ?? {}), [name]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const buildPayload = () => {
      if (order.deliveryType === 'pickup') {
        const pickupPayload = {
          delivery_date: draftSchedule?.deliveryDate ?? order.deliveryDate,
          delivery_from:
            draftSchedule?.deliveryFrom ?? formatTime(order.deliveryFrom),
        };

        return pickupPayload;
      }

      if (order.deliveryType === 'delivery') {
        const deliveryPayload = {
          delivery_date: draftSchedule?.deliveryDate ?? order.deliveryDate,
          delivery_from:
            draftSchedule?.deliveryFrom ?? formatTime(order.deliveryFrom),
          delivery_to:
            draftSchedule?.deliveryTo ?? formatTime(order.deliveryTo),
        };

        return deliveryPayload;
      }
    };

    try {
      await apiClient.patch(`/api/orders/${orderId}/schedule`, buildPayload());
      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setIsEditing(false);
      setDraftSchedule(null);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 403) {
          return toast.error(
            '現在のユーザーでこの注文を変更する権限がありません',
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
      toast.error('変更に失敗しました');
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
            <div className="px-2 py-1">
              <Label className="pr-4 text-xs text-gray-500">納品日:</Label>
              <Input
                className="flex-1"
                disabled={!isEditing}
                value={draftSchedule?.deliveryDate ?? order.deliveryDate}
                min={getTodayDateInputValue()}
                type="date"
                name="deliveryDate"
                onChange={handleChange}
              />
            </div>

            {/* deliveryの時のUI */}

            <div>
              <div className="px-2 py-1">
                <Label className="pr-4 text-xs text-gray-500">納品時間:</Label>
                <div className="flex text-base">
                  {/* deliveryFrom */}
                  <TimeSelect
                    disabled={!isEditing}
                    value={
                      draftSchedule?.deliveryFrom ??
                      formatTime(order.deliveryFrom)
                    }
                    onChange={(value) => {
                      setDraftSchedule((prev) => ({
                        ...(prev ?? {}),
                        deliveryFrom: value,
                      }));
                    }}
                  />
                  {order.deliveryType === 'delivery' && <span>~</span>}
                  {order.deliveryType === 'delivery' && (
                    // deliveryFrom
                    <TimeSelect
                      disabled={!isEditing}
                      value={
                        draftSchedule?.deliveryTo ??
                        formatTime(order.deliveryTo)
                      }
                      onChange={(value) => {
                        setDraftSchedule((prev) => ({
                          ...(prev ?? {}),
                          deliveryTo: value,
                        }));
                      }}
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
