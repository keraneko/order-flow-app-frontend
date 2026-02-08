import { useEffect, useState } from 'react';
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
import type { Order } from '@/types/Order';
import { formatOrderStatus } from '@/Utils/formatOrderStatus';

function IndexOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchOrders();
  }, []);

  if (isLoading) return <div>Loading... </div>;

  const formatYen = (num: number) => num.toLocaleString();

  const formatOrderedAt = (s: string): string => {
    const parts = s.split(' ');
    const date = parts[0].replace(/-/g, '/');
    const time = parts[1].slice(0, 5);

    return `${date} ${time}`;
  };

  return (
    <>
      {error !== null && <div className="text-red-500">{error}</div>}
      {error === null && (
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
            {orders.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatOrderedAt(order.orderedAt)}</TableCell>
                <TableCell>{formatOrderStatus(order.status)}</TableCell>
                <TableCell className="text-right">
                  ¥{formatYen(order.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default IndexOrdersPage;
