import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/axios';
import type { OrderShow, OrderStatus } from '@/types/order';
import {
  getAxiosMessage,
  getFirstAxiosValidationMessage,
} from '@/utils/apiError';
import { formatDay } from '@/utils/formatDay';

interface OrderSummaryProps {
  order: OrderShow;
  orderId: number;
}

function OrderSummary({ order, orderId }: OrderSummaryProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );

  const handleStatusSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = { status: selectedStatus };
      await apiClient.patch(`/api/orders/${order.id}/status`, payload);

      toast.success('更新しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });

      setIsEditing(false);
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleStatusSubmit();
      }}
    >
      <div className="mb-5 grid grid-cols-3 gap-4 rounded-xl border shadow-sm">
        <div className="my-3 flex flex-col justify-center px-4">
          <p className="text-xs text-gray-500">注文ID</p>
          <p className="font-medium">#{order.id}</p>
        </div>

        <div className="my-3 flex flex-col justify-center border-l px-4">
          <p className="text-xs text-gray-500">注文日</p>
          <p className="font-medium">{formatDay(order.orderedAt)}</p>
        </div>

        <div className="my-3 flex flex-col justify-center border-l px-4">
          <p className="text-xs text-gray-500">ステータス</p>

          {/* 表示モード */}
          {!isEditing && (
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={order.status} />
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={order.status !== 'received'}
                >
                  <Badge
                    variant="outline"
                    className={
                      order.status !== 'received'
                        ? 'cursor-not-allowed opacity-40'
                        : 'hover:bg-gray-100'
                    }
                  >
                    編集
                  </Badge>
                </button>
              </div>
            </div>
          )}

          {/* 編集モード */}
          {isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <select
                value={selectedStatus}
                className="rounded border px-1 py-0.5 text-xs"
                onChange={(e) => {
                  const value = e.target.value;

                  if (
                    value === 'received' ||
                    value === 'completed' ||
                    value === 'canceled'
                  ) {
                    setSelectedStatus(value);
                  }
                }}
              >
                <option value="received">受注</option>
                <option value="completed">完了</option>
                <option value="canceled">キャンセル</option>
              </select>

              <button type="submit" disabled={isSubmitting}>
                <Badge
                  variant="outline"
                  className={isSubmitting ? 'opacity-40' : 'hover:bg-gray-100'}
                >
                  保存
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedStatus(order.status);
                }}
              >
                <Badge variant="destructive">中止</Badge>
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default OrderSummary;
