import { Link, useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@/api/orders';
import FulfillmentInfoCard from '@/components/order/FulfillmentInfoCard';
import OrderCustomer from '@/components/order/OrderCustomer';
import OrderItemsTable from '@/components/order/OrderItemsTable';
import OrderSummary from '@/components/order/OrderSummary';
import type { OrderShow } from '@/types/order';

function IndexOrderPageTest() {
  const { id } = useParams();
  const orderId = Number(id);
  const enabled = Number.isFinite(orderId) && orderId > 0;
  const navigate = useNavigate();

  const {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery<OrderShow>({
    queryKey: ['orders', orderId],
    enabled,
    queryFn: () => getOrder(orderId),
  });

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!order) return <span>データがありません</span>;

  return (
    <>
      <button
        className="mb-3 border-b text-xs text-gray-500 hover:text-blue-400"
        onClick={() => void navigate('/orders')}
      >
        ←注文一覧に戻る
      </button>

      <h2 className="mb-5 border-b">注文番号 #{order.id}</h2>

      {/* 注文サマリ */}
      <OrderSummary order={order} orderId={orderId} />

      {/* 顧客情報 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <OrderCustomer order={order} orderId={orderId} />

          {/* スケジュール、配送情報 */}
          <FulfillmentInfoCard order={order} orderId={orderId} />
        </div>

        {/* 注文詳細 */}
        <div>
          <OrderItemsTable order={order} />
          {order.status === 'received' && (
            <div className="text-right">
              <Link
                to={`/orders/${order.id}/items/edit`}
                className="border-b text-sm text-violet-600"
              >
                注文商品を変更する→
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default IndexOrderPageTest;
