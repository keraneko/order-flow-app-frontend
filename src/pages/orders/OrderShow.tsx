import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@/api/orders';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrderShow } from '@/types/order';
import { formatOrderStatus } from '@/utils/formatOrderStatus';

function IndexOrderPageTest() {
  const { id } = useParams();
  const orderId = Number(id);
  const enabled = Number.isFinite(orderId) && orderId > 0;

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

  const formatOrderedAt = (s: string): string => {
    const parts = s.split(' ');
    const data = parts[0].replace(/-/g, '/');
    const time = parts[1].slice(0, 5);

    return `${data} ${time}`;
  };

  console.log(order);
  console.log(orderId);

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!order) return <span>データがありません</span>;

  return (
    <>
      <Table>
        <TableCaption>注文一覧表</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-5">注文ID</TableHead>
            <TableHead>注文日</TableHead>
            <TableHead className="w-[100px]">ステータス</TableHead>
            <TableHead className="text-right">合計金額</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{formatOrderedAt(order.orderedAt)}</TableCell>
            <TableCell>{formatOrderStatus(order.status)}</TableCell>
            <TableCell className="text-right">
              ¥{formatYen(order.totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p>{order.id}</p>
      <p>{order.customer.name}</p>
      <p>{order.orderedAt}</p>
      {order.items.map((item, id) => (
        <div key={id}>
          <div className="flex">
            <div>{item.product.name}</div>
            <div>{item.quantity}個</div>
            <div>{item.unitPrice}円</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default IndexOrderPageTest;
