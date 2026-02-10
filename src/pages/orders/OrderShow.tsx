import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getOrder } from '@/api/orders';
import NotFound from '@/pages/NotFound';
import { type OrderShow } from '@/types/order';

function OrderShowPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const [order, setOrder] = useState<OrderShow | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(orderId)) {
      setError('不正なIDです');
      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    setError(null);

    async function fetchOrderShow() {
      try {
        const data = await getOrder(orderId);
        setOrder(data);

        if (data === null) {
          setOrder(null);

          return;
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchOrderShow();
  }, [orderId]);

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
