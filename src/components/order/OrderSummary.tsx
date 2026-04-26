import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/axios';
import type { OrderShow, OrderStatus } from '@/types/order';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';
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

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleStatusSubmit();
        }}
      >
        <div className="mb-5 grid grid-cols-3 gap-4 rounded-sm border shadow-xs">
          <div className="my-2 flex flex-col justify-center px-4 text-left">
            <p>注文ID</p>
            <p>#{order.id}</p>
          </div>
          <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
            <p>注文日</p>
            <p>{formatDay(order.orderedAt)}</p>
          </div>
          <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
            <p>ステータス</p>
            <div className="">
              {!isEditing && (
                <div className="flex justify-around">
                  <OrderStatusBadge status={order.status} />
                  <button onClick={() => setIsEditing(true)} type="button">
                    <Badge variant="outline">編集</Badge>
                  </button>
                </div>
              )}
              {isEditing && (
                <div className="flex justify-around text-xs">
                  <select
                    value={selectedStatus}
                    className="border text-center"
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
                    <Badge variant="outline">保存</Badge>
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedStatus(order.status);
                    }}
                    type="button"
                  >
                    <Badge variant="destructive">中止</Badge>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default OrderSummary;
