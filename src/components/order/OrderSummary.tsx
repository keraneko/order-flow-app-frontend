import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { Badge } from '@/components/ui/badge';
import type { OrderShow, OrderStatus } from '@/types/order';
import { formatDay } from '@/utils/formatDay';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

interface OrderSummaryProps {
  order: OrderShow;
  orderId: number;
}

function OrderSummary({ order, orderId }: OrderSummaryProps) {
  const queryClient = useQueryClient();
  const [isEditting, setIsEditting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );

  const handleStatusSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = { status: selectedStatus };
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(getFirstValidationMessage(res));
        }

        return;
      }
      toast.success('登録しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });

      setIsEditting(false);
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
              {!isEditting && (
                <div className="flex justify-around">
                  <OrderStatusBadge status={order.status} />
                  <button
                    onClick={() => setIsEditting(true)}
                    type="button"
                    className="border-b text-xs text-violet-600"
                  >
                    変更
                  </button>
                </div>
              )}
              {isEditting && (
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
                  <button type="submit">
                    <Badge variant="outline">保存</Badge>
                  </button>

                  <button
                    onClick={() => {
                      setIsEditting(false);
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
          {/* <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
          <p>合計金額</p>
          <p>{formatYen(order.totalAmount)}</p>
        </div> */}
        </div>
      </form>
    </>
  );
}

export default OrderSummary;
