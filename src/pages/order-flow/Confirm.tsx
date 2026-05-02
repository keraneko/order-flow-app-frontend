import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getStores } from '@/api/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/cart/useCart';
import { useCustomer } from '@/context/customer/useCustomer';
import { useFulfillment } from '@/context/fulfillment/useFulfillment';
import { useOrder } from '@/context/order/useOrder';
import { formatDay } from '@/utils/formatDay';
import { formatYen } from '@/utils/formatYen';

function Confirm() {
  const navigate = useNavigate();
  const { fulfillment, resetFulfillment } = useFulfillment();
  const { customer, resetCustomer } = useCustomer();
  const { items, totalPrice, totalItem, clearCart } = useCart();
  const { createOrder, resetOrder } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = totalPrice;
  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createOrder({
        fulfillment,
        customer,
        items,
        totalAmount,
      });
      toast.success('注文を確定しました');
      resetFulfillment();
      resetOrder();
      clearCart();
      resetCustomer();

      void navigate('/');
    } catch (e) {
      const message = e instanceof Error ? e.message : '注文に失敗しました';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });
  const storeName = stores?.find(
    (s) => s.id === fulfillment.pickupStoreId,
  )?.name;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <h2 className="text-lg font-bold">注文内容の確認</h2>

      {/* 商品一覧 */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>単価</TableHead>
              <TableHead>小計</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image ? (
                    <img
                      className="h-16 w-16 shrink-0 rounded-lg object-contain"
                      src={`http://localhost/storage/${item.image}`}
                      alt={item.name}
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      画像なし
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}個</TableCell>
                <TableCell>{formatYen(item.price)}</TableCell>
                <TableCell className="font-semibold text-amber-700">
                  {formatYen(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 合計 */}
        <div className="flex items-center justify-between border-t bg-amber-50 px-4 py-3">
          <p className="text-sm text-gray-500">商品小計（{totalItem}点）</p>
          <p className="text-xl font-bold text-amber-700">
            {formatYen(totalPrice)}
          </p>
        </div>
      </div>

      {/* 受取・配達情報 */}
      <div className="flex flex-col gap-3 rounded-xl border p-4">
        <p className="font-semibold">受取情報</p>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-500">納品日</span>
          <span className="font-medium">
            {formatDay(fulfillment.deliveryDate)}
          </span>

          <span className="text-gray-500">納品方法</span>
          <span className="font-medium">
            {fulfillment.deliveryType === 'pickup' ? '店舗受取' : '配達'}
          </span>

          <span className="text-gray-500">納品時間</span>
          <span className="font-medium">
            {fulfillment.deliveryType === 'pickup'
              ? fulfillment.deliveryFrom
              : `${fulfillment.deliveryFrom}〜${fulfillment.deliveryTo}`}
          </span>

          {fulfillment.deliveryType === 'pickup' && (
            <>
              <span className="text-gray-500">受取店舗</span>
              <span className="font-medium">{storeName}</span>
            </>
          )}

          {fulfillment.deliveryType === 'delivery' && (
            <>
              <span className="text-gray-500">郵便番号</span>
              <span className="font-medium">{customer.deliveryPostalCode}</span>

              <span className="text-gray-500">配達先住所</span>
              <span className="font-medium">{customer.deliveryAddress}</span>
            </>
          )}
        </div>
      </div>

      {/* お客様情報 */}
      <div className="flex flex-col gap-3 rounded-xl border p-4">
        <p className="font-semibold">お客様情報</p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-500">名前</Label>
            <Input
              className="rounded-xl bg-gray-50"
              value={customer.name}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-500">住所</Label>
            <Input
              className="rounded-xl bg-gray-50"
              value={customer.address}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-500">電話番号</Label>
            <Input
              className="rounded-xl bg-gray-50"
              value={customer.phone}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-500">備考</Label>
            <Textarea
              className="rounded-xl bg-gray-50"
              value={customer.note}
              disabled
            />
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex flex-col gap-2">
        <Button
          disabled={isSubmitting}
          onClick={() => void handleConfirm()}
          className="h-12 w-full rounded-xl bg-amber-700 text-base font-medium hover:bg-amber-800 disabled:bg-gray-300"
        >
          {isSubmitting ? '送信中...' : '注文を確定する'}
        </Button>
        <Link to="/order/cart">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-gray-500"
          >
            カートに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Confirm;
