import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getOrder } from '@/api/orders';
import NotFound from '@/pages/NotFound';
import { type OrderShow } from '@/types/order';

function OrderShowPage() {
  const { orderId } = useParams();
  const idNum = Number(orderId);

  const [order, setOrder] = useState<OrderShow | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(idNum)) {
      setError('不正なIDです');
      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    setError(null);

    async function fetchOrderShow() {
      try {
        const data = await getOrder(idNum);
        setOrder(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchOrderShow();
  }, [idNum]);

  if (isLoading) return <div>Loading...</div>;

  if (order === null) return <NotFound />;

  if (order === undefined) return null;

  return (
    <>
      {error}
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

export default OrderShowPage;
