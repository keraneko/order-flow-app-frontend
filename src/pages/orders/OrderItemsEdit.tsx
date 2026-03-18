import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getOrder, updateOrderItems } from '@/api/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type OrderShow } from '@/types/order';
import { formatYen } from '@/utils/formatYen';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderItemsEditorProps {
  initialItems: OrderItem[];
  orderId: number;
}

function OrderItemsEditor({ initialItems, orderId }: OrderItemsEditorProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (id: number, newQuantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, quantity: newQuantity } : i,
      ),
    );
  };

  const totalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    const itemsPayload = items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    }));

    const payload = {
      items: itemsPayload,
    };
    setIsSubmitting(true);
    try {
      await updateOrderItems(orderId, payload);
      await queryClient.invalidateQueries({
        queryKey: ['ordersItem', orderId],
        exact: true,
      });

      toast.success('更新に成功しました');
      void navigate(`/orders/${orderId}`);
    } catch {
      toast.error('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        {items.map((item) => (
          <div key={item.productId}>
            <div className="grid grid-cols-4 border-b py-2 text-center">
              <div>{item.productName}</div>
              <div>{formatYen(item.price)}</div>
              <Input
                type="number"
                className="w-15 text-center"
                value={item.quantity}
                onChange={(e) => {
                  handleChange(item.productId, Number(e.target.value));
                }}
              />
              <div>{formatYen(item.quantity * item.price)}</div>
            </div>
          </div>
        ))}
        <div className="text-right">
          <span>合計金額</span>
          <span>{formatYen(totalPrice)}</span>
        </div>
        <div className="mt-10 text-center">
          <Button disabled={isSubmitting} variant="outline">
            変更を保存する
          </Button>
        </div>
      </form>
    </>
  );
}

export default function OrderItemsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = Number(id);
  const enabled = Number.isFinite(orderId) && orderId > 0;

  const {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery<OrderShow>({
    queryKey: ['ordersItem', orderId],
    enabled,
    queryFn: () => getOrder(orderId),
  });

  if (isPending) return <span>読み込み中...</span>;

  if (isError) return <span>エラーコード: {error.message}</span>;

  if (!order) return <span>データがありません</span>;

  const orderItemsApi: OrderItem[] = order.items.map((i) => ({
    productId: i.product.id,
    productName: i.product.name,
    quantity: i.quantity,
    price: i.unitPrice,
  }));

  const initialItems = orderItemsApi;

  return (
    <>
      <button
        onClick={() => {
          void navigate(-1);
        }}
        className="mb-3 border-b text-xs text-gray-500 hover:text-blue-400"
      >
        ←戻る
      </button>

      <OrderItemsEditor initialItems={initialItems} orderId={orderId} />
    </>
  );
}
