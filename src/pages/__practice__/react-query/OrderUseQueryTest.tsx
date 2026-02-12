import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orders';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrderIndex } from '@/types/order';
import { formatOrderStatus } from '@/utils/formatOrderStatus';

function IndexOrderPageTest() {
  const navigate = useNavigate();
  const {
    data: orders,
    isPending,

    isError,
    error,
  } = useQuery<OrderIndex[]>({
    queryKey: ['orderShows'],
    queryFn: getOrders,
  });

  const formatYen = (num: number) => num.toLocaleString();

  const formatOrderedAt = (s: string): string => {
    const parts = s.split(' ');
    const data = parts[0].replace(/-/g, '/');
    const time = parts[1].slice(0, 5);

    return `${data} ${time}`;
  };

  const handleClick = (orderId: number) => navigate(`/orders/${orderId}`);

  console.log(orders);

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!orders) return <span>データがありません</span>;

  return (
    <>
      <Table>
        <TableCaption>注文一覧表</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-5">ID</TableHead>
            <TableHead>注文日</TableHead>
            <TableHead className="w-[100px]">ステータス</TableHead>
            <TableHead className="text-right">合計金額</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order: OrderIndex) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{formatOrderedAt(order.orderedAt)}</TableCell>
              <TableCell>{formatOrderStatus(order.status)}</TableCell>
              <TableCell className="text-right">
                ¥{formatYen(order.totalAmount)}
              </TableCell>
              <TableCell
                className="text-center text-blue-400 hover:text-blue-600"
                onClick={() => void handleClick(order.id)}
              >
                詳細
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default IndexOrderPageTest;
