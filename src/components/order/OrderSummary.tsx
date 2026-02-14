import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { type OrderShow } from '@/types/order';
import { formatDay } from '@/utils/formatDay';
import { formatYen } from '@/utils/formatYen';

interface OrderSummaryProps {
  order: OrderShow;
}

function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <>
      <div className="mb-5 grid h-20 grid-cols-4 gap-4 rounded-sm border shadow-xs">
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
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
          <p>合計金額</p>
          <p>{formatYen(order.totalAmount)}</p>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
