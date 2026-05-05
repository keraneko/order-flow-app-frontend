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
    <div className="flex flex-col gap-6">
      {/* 戻るボタン */}
      <button
        className="flex w-fit items-center gap-1 text-sm text-gray-400 transition-colors hover:text-amber-700"
        onClick={() => void navigate('/orders')}
      >
        ← 注文一覧に戻る
      </button>

      {/* ページタイトル */}
      <h2 className="border-b pb-3 text-xl font-bold">注文番号 #{order.id}</h2>

      {/* ① 注文サマリ */}
      <OrderSummary order={order} orderId={orderId} />

      {/* 編集不可バナー */}
      {order.status !== 'received' && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          {order.status === 'completed'
            ? '完了済みのため、内容の編集はできません'
            : 'キャンセル済みのため、内容の編集はできません'}
        </div>
      )}

      {/* ② 商品テーブル */}
      <div className="flex flex-col gap-2">
        <OrderItemsTable order={order} />
        {order.status === 'received' && (
          <div className="text-right">
            <Link
              to={`/orders/${order.id}/items/edit`}
              className="text-sm text-amber-700 transition-colors hover:text-amber-800 hover:underline"
            >
              注文商品を変更する →
            </Link>
          </div>
        )}
      </div>

      {/* ③ 顧客情報 | 受取先情報 */}
      <div className="grid grid-cols-2 items-start gap-5">
        <OrderCustomer order={order} orderId={orderId} />
        <FulfillmentInfoCard order={order} orderId={orderId} />
      </div>
    </div>
  );
}

export default IndexOrderPageTest;
