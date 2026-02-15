import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@/api/orders';
import type { OrderShow } from '@/types/order';

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

  //   const formatYen = (num: number) => num.toLocaleString();

  //   const formatOrderedAt = (s: string): string => {
  //     const parts = s.split(' ');
  //     const data = parts[0].replace(/-/g, '/');
  //     const time = parts[1].slice(0, 5);

  //     return `${data} ${time}`;
  //   };

  //const handleClick = (orderId: number) => navigate(`/orders/${orderId}`);

  console.log(order);
  console.log(orderId);

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!order) return <span>データがありません</span>;

  return (
    <>
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
      {order.totalAmount}円
    </>
  );
}

export default IndexOrderPageTest;
