import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/axios';
import type { OrderShow } from '@/types/order';
import {
  getAxiosMessage,
  getFirstAxiosValidationMessage,
} from '@/utils/apiError';
import { getDateInputValueAfterDays } from '@/utils/date';
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
        const validationMessage = getFirstAxiosValidationMessage(
          e.response?.data,
        );
        const apiMessage = getAxiosMessage(e.response?.data);

        if (status === 403) {
          toast.error('現在のユーザーでこの注文を変更する権限がありません');

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
      toast.error('変更に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="border-b pb-3">
        {/* 編集ボタン */}
        <div className="flex items-center justify-end py-1 pr-1">
          {!isEditing && (
            <button
              disabled={order.status !== 'received'}
              type="button"
              onClick={() => setIsEditing(true)}
              className={
                order.status !== 'received'
                  ? 'cursor-not-allowed opacity-30 grayscale'
                  : 'cursor-pointer'
              }
            >
              <Badge variant="outline">編集</Badge>
            </button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <button
                disabled={isSubmitting}
                type="submit"
                className={isSubmitting ? 'opacity-40' : ''}
              >
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

        {/* 納品日 */}
        <div className="flex flex-col gap-1 px-2 py-1">
          <Label className="text-xs text-gray-500">納品日</Label>
          <Input
            disabled={!isEditing}
            value={draftSchedule?.deliveryDate ?? order.deliveryDate}
            min={getDateInputValueAfterDays(2)}
            type="date"
            name="deliveryDate"
            onChange={handleChange}
            className="rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* 納品時間 */}
        <div className="flex flex-col gap-1 px-2 py-1">
          <Label className="text-xs text-gray-500">納品時間</Label>
          <div className="flex items-center gap-2">
            <TimeSelect
              disabled={!isEditing}
              value={
                draftSchedule?.deliveryFrom ?? formatTime(order.deliveryFrom)
              }
              onChange={(value) => {
                setDraftSchedule((prev) => ({
                  ...(prev ?? {}),
                  deliveryFrom: value,
                }));
              }}
            />
            {order.deliveryType === 'delivery' && (
              <>
                <span className="text-gray-400">〜</span>
                <TimeSelect
                  disabled={!isEditing}
                  value={
                    draftSchedule?.deliveryTo ?? formatTime(order.deliveryTo)
                  }
                  onChange={(value) => {
                    setDraftSchedule((prev) => ({
                      ...(prev ?? {}),
                      deliveryTo: value,
                    }));
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
