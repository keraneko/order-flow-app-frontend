import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getOrder, updateOrderItems } from '@/api/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type OrderShow } from '@/types/order';
import type { OrderItemsCandidateProduct } from '@/types/product';
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
  products: OrderItemsCandidateProduct[];
}

interface OrderProductsApi {
  id: number;
  name: string;
  price: number;
}

//* ----------- OrderItemsEditor -------- *//
function OrderItemsEditor({
  initialItems,
  orderId,
  products,
}: OrderItemsEditorProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormErrors] = useState<string | null>(null);

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
  type Draftquantity = Record<number, number>;

  const [draftQuantities, setDraftQuantities] = useState<Draftquantity>({});
  const filteredProduct = products.filter(
    (p) => !items.some((item) => item.productId === p.id),
  );

  const handleDraftChange = (productId: number, quantity: number) => {
    setDraftQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleAddProduct = (product: OrderProductsApi) => {
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
          setFormErrors(error);

          if (error) {
            return;
          }
          void handleSubmit();
        }}
      >
        {formError && <span className="text-sm text-red-500">{formError}</span>}

        {/* ----------- ItemsUI -------- */}
        {items.length === 0 && (
          <div className="text-sm text-red-400">商品を選択してください</div>
        )}
        <div className="my-2 flex">
          <span className="text- border-b text-base font-bold">
            現在の注文内容
          </span>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-blue-50 hover:bg-blue-50">
              <TableHead className="">商品名</TableHead>
              <TableHead className="">単価</TableHead>
              <TableHead>数量</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.productId} className="hover:bg-transparent">
                <TableCell className="">{item.productName}</TableCell>
                <TableCell>{formatYen(item.price)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-13 text-center"
                    value={item.quantity}
                    onChange={(e) => {
                      handleChange(item.productId, Number(e.target.value));
                    }}
                  />
                  <span className="ml-2">個</span>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      removeItem(item.productId);
                    }}
                  >
                    削除する
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="px-2 py-1 text-right">
          <span className="border-b">
            <span className="mr-2">合計金額 </span>
            <span className="font-bold">{formatYen(totalPrice)}</span>
          </span>
        </div>

        {/* ↑↑↑↑↑↑↑↑↑↑ ItemsUI ↑↑↑↑↑↑↑↑↑↑↑*/}

        {/* ----------- draftProductItemsUI -------- */}
        <div className="my-2 flex">
          <span className="text- border-b text-base font-bold">
            追加可能な注文
          </span>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-blue-50 hover:bg-blue-50">
              <TableHead className="text-shadow-accent-foreground">
                商品名
              </TableHead>
              <TableHead className="">単価</TableHead>
              <TableHead>数量</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProduct.map((product) => (
              <TableRow key={product.id} className="hover:bg-transparent">
                <TableCell className="">{product.name}</TableCell>
                <TableCell>{formatYen(product.price)}</TableCell>
                <TableCell>
                  {/* onBlurで後日調整 */}
                  <Input
                    type="number"
                    className="w-13 text-center"
                    value={draftQuantities[product.id] ?? 1}
                    onChange={(e) =>
                      handleDraftChange(product.id, Number(e.target.value))
                    }
                  />
                  <span className="ml-2">個</span>
                </TableCell>
                <TableCell>
                  <div>
                    <Button
                      type="button"
                      onClick={() => handleAddProduct(product)}
                    >
                      追加する
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
    isLoading: isProductsLoading,
    isError: isProductError,
    error: productsError,
  } = useQuery<OrderItemsCandidateProduct[]>({
    queryKey: ['orderItemsProducts'],
    queryFn: async () => {
      const res = await fetch('/api/products');

      if (!res.ok) throw new Error(`HTTP${res.status}`);
      const data = (await res.json()) as OrderProductsApi[];

      const products = data.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
      }));

      return products;
    },
  });

  console.log(products);

  if (isOrderPending) return <span>order読み込み中...</span>;

  if (isProductsLoading) return <span>product読み込み中...</span>;

  if (isOrderError) return <span>orderエラーコード: {orderError.message}</span>;

  if (isProductError)
    return <span>productsエラーコード: {productsError.message}</span>;

  if (!order) return <span>orderデータがありません</span>;

  if (!products) return <span>productsデータがありません</span>;

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

      <OrderItemsEditor
        initialItems={initialItems}
        orderId={orderId}
        products={products}
      />
    </>
  );
}
