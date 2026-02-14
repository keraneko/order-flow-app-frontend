import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Phone, User } from 'lucide-react';
import { getOrder } from '@/api/orders';
import OrderItemsTable from '@/components/order/OrderItemsTable';
import OrderSummary from '@/components/order/OrderSummary';
import { Label } from '@/components/ui/label';
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

  console.log(order);
  console.log(orderId);

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
      <OrderSummary order={order} />

      {/* 顧客情報 ＆ 配送情報 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="rounded-sm border">
            <Label className="h-10 border-b pl-4 font-semibold">顧客情報</Label>
            <div className="flex h-20 flex-col justify-around">
              <div className="flex h-20 border-b py-2">
                <div>
                  <User className="text-muted-foreground mx-4 h-5 w-5" />
                </div>
                <div className="flex flex-col justify-between">
                  <Label>{order.customer.name} 様</Label>
                  <Label>{order.customer.address}</Label>
                </div>
              </div>
              <div className="flex py-2">
                <Phone className="text-muted-foreground mx-4 h-5 w-5" />
                <Label>{order.customer.phone}</Label>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-sm border">
            <Label className="h-10 pl-4 font-semibold">配送情報</Label>
          </div>
        </div>

        {/* 注文詳細 */}
        <OrderItemsTable order={order} />
      </div>
    </>
  );
}

export default IndexOrderPageTest;
