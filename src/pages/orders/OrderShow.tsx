import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Phone, User } from 'lucide-react';
import { getOrder } from '@/api/orders';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

  const formatYen = (num: number) => num.toLocaleString();

  const formatOrderedDay = (s: string): string => {
    const parts = s.split(' ');

    return parts[0].replace(/-/g, '/');
  };
  console.log(order);
  console.log(orderId);

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!order) return <span>データがありません</span>;

  return (
    <>
      <button
        className="mb-3 border-b text-xs text-gray-500"
        onClick={() => void navigate('/orders')}
      >
        ←注文一覧に戻る
      </button>

      <h2 className="mb-5 border-b">注文番号 #{order.id}</h2>

      <div className="mb-5 grid h-20 grid-cols-4 gap-4 rounded-sm border">
        <div className="my-2 flex flex-col justify-center px-4 text-left">
          <p>注文ID</p>
          <p>{order.id}</p>
        </div>
        <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
          <p>注文日</p>
          <p>{formatOrderedDay(order.orderedAt)}</p>
        </div>
        <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
          <p>ステータス</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="my-2 flex flex-col justify-center border-l px-4 text-left">
          <p>合計金額</p>
          <p>¥{formatYen(order.totalAmount)}</p>
        </div>
      </div>

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

        <Table className="border">
          <TableHeader>
            <TableRow className="pointer-events-none bg-blue-50">
              <TableHead className="">商品名</TableHead>
              <TableHead>数量</TableHead>
              <TableHead className="">金額</TableHead>
              <TableHead className="">小計</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell className="">{item.product.name}</TableCell>
                <TableCell>{item.quantity}個</TableCell>
                <TableCell>{formatYen(item.unitPrice)}円</TableCell>
                <TableCell className="">
                  {formatYen(item.unitPrice * item.quantity)}円
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} className="pr-4 text-right">
                合計 {formatYen(order.totalAmount)}円
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default IndexOrderPageTest;
