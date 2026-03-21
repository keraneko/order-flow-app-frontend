import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getOrder, updateOrderItems } from '@/api/orders';
import { getOrderProducts } from '@/api/products';
import AddableOrderItemsSection from '@/components/order/AddableOrderItemsSection';
import CurrentOrderItemsSection from '@/components/order/CurrentOrderItemsSection';
import { Button } from '@/components/ui/button';
import { type OrderEditItem, type OrderShow } from '@/types/order';
import type { OrderItemsCandidateProduct } from '@/types/product';

interface OrderItemsEditorProps {
  initialItems: OrderEditItem[];
  orderId: number;
  products: OrderItemsCandidateProduct[];
}

type DraftQuantities = Record<number, number>;

//* ----------- OrderItemsEditor -------- *//
function OrderItemsEditor({
  initialItems,
  orderId,
  products,
}: OrderItemsEditorProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<OrderEditItem[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  //orderItemsロジック
  const validate = () => {
    if (items.some((i) => i.quantity < 1)) {
      return '数量は1以上で入力してください';
    }

    if (items.length === 0) {
      return '商品を選択してください';
    }

    return null;
  };

  const handleChange = (id: number, newQuantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, quantity: newQuantity } : i,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== id));
  };

  const totalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    if (items.length === 0) return;
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
  //productロジック
  const [draftQuantities, setDraftQuantities] = useState<DraftQuantities>({});
  const filteredProducts = products.filter(
    (p) => !items.some((item) => item.productId === p.id),
  );

  const handleDraftChange = (productId: number, quantity: number) => {
    setDraftQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleAddProduct = (product: OrderItemsCandidateProduct) => {
    const quantity = draftQuantities[product.id] ?? 1;

    if (quantity < 1) return;
    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      },
    ]);

    setDraftQuantities((prev) => {
      const next = { ...prev };
      delete next[product.id];

      return next;
    });
  };

  return (
    <>
      {/* ----------- From -------- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const error = validate();
          setFormError(error);

          if (error) {
            return;
          }
          void handleSubmit();
        }}
      >
        {formError && <span className="text-sm text-red-500">{formError}</span>}
        {/* ----------- CurrentOrderItemsSection -------- */}
        <CurrentOrderItemsSection
          items={items}
          totalPrice={totalPrice}
          handleChange={handleChange}
          removeItem={removeItem}
        />

        {/* ----------- AddableOrderItemsSection -------- */}
        <AddableOrderItemsSection
          filteredProducts={filteredProducts}
          draftQuantities={draftQuantities}
          handleDraftChange={handleDraftChange}
          handleAddProduct={handleAddProduct}
        />
        <div className="my-5 text-center">
          <Button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            variant="outline"
          >
            変更を保存する
          </Button>
        </div>
      </form>
    </>
  );
}

//* ----------- OrderItemsEdit -------- *//

export default function OrderItemsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = Number(id);
  const enabled = Number.isFinite(orderId) && orderId > 0;

  const {
    data: order,
    isPending: isOrderPending,
    isError: isOrderError,
    error: orderError,
  } = useQuery<OrderShow>({
    queryKey: ['ordersItem', orderId],
    enabled,
    queryFn: () => getOrder(orderId),
  });

  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductsError,
    error: productsError,
  } = useQuery<OrderItemsCandidateProduct[]>({
    queryKey: ['orderItemsProducts'],
    queryFn: getOrderProducts,
  });

  if (isOrderPending) return <span>order読み込み中...</span>;

  if (isProductsPending) return <span>product読み込み中...</span>;

  if (isOrderError) return <span>orderエラーコード: {orderError.message}</span>;

  if (isProductsError)
    return <span>productsエラーコード: {productsError.message}</span>;

  if (!order) return <span>orderデータがありません</span>;

  if (!products) return <span>productsデータがありません</span>;

  const orderItemsApi: OrderEditItem[] = order.items.map((i) => ({
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

      <OrderItemsEditor
        initialItems={initialItems}
        orderId={orderId}
        products={products}
      />
    </>
  );
}
