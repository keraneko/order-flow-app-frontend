import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/types/Orders';
import { getOrders } from '@/types/Orders';

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

  return (
    <>
      {error}

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
              <TableCell>{order.orderedAt}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className="text-right">¥{order.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default IndexOrdersPage;
