import { Link, useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Phone, User } from 'lucide-react';
import { getOrder } from '@/api/orders';
import OrderItemsTable from '@/components/order/OrderItemsTable';
import OrderSummary from '@/components/order/OrderSummary';
import { Label } from '@/components/ui/label';
import type { OrderShow } from '@/types/order';
import { formatDay } from '@/utils/formatDay';
import { formatTime } from '@/utils/formatTime';

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

      {/* 顧客情報 ＆ 配送情報 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="rounded-sm border">
            <Label className="h-10 border-b pl-4 font-semibold">顧客情報</Label>
            <div className="flex flex-col justify-around">
              <div className="flex items-start border-b p-2">
                <div>
                  <User className="text-muted-foreground mx-4 mt-2 h-5 w-5" />
                </div>
                <div className="flex flex-col justify-between p-2">
                  <Label className="pb-2">{order.customer.name} 様</Label>
                  <Label>{order.customer.address}</Label>
                </div>
              </div>
              <div className="flex p-2">
                <Phone className="text-muted-foreground mx-4 h-5 w-5" />
                <Label>{order.customer.phone}</Label>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-sm border">
            <Label className="h-10 border-b pl-4 font-semibold">配送情報</Label>
            <div className="flex px-2 py-1">
              <Label className="pr-4 text-gray-500">納品日:</Label>
              <Label className="text-base">
                {formatDay(order.deliveryDate)}
              </Label>
            </div>

            {order.deliveryType === 'delivery' && (
              <div>
                <div className="flex px-2 py-1">
                  <Label className="pr-4 text-gray-500">納品時間:</Label>
                  <Label className="text-base">
                    {formatTime(order.deliveryFrom)}〜
                    {formatTime(order.deliveryTo)}
                  </Label>
                </div>
                <div className="flex items-start p-2">
                  <div>
                    <Label className="py-1 text-gray-500">配送先住所:</Label>
                    <Label className="py-1">
                      〒 {order.deliveryPostalCode}
                    </Label>
                    <Label className="py-1 text-sm">
                      {order.deliveryAddress}
                    </Label>
                  </div>
                </div>
              </div>
            )}
            {order.deliveryType === 'pickup' && order.pickupStore === null && (
              <Label className="ml-4 p-2 text-sm text-red-400">
                店舗情報を取得できませんでした
              </Label>
            )}
            {order.deliveryType === 'pickup' && order.pickupStore !== null && (
              <div>
                <div className="ml-4 flex px-2 py-1">
                  <Label className="pr-4 text-gray-500">納品時間:</Label>
                  <Label className="text-base">
                    {formatTime(order.deliveryFrom)}
                  </Label>
                </div>
                <div className="ml-4 flex px-2 py-1">
                  <Label className="pr-4 text-gray-500">受取店舗:</Label>
                  <Label className="text-base">{order.pickupStore.name}</Label>
                </div>
              </div>
            )}
          </div>
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
