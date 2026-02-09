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
import { useOrder } from '@/context/order/useOrder';

function Confirm() {
  const navigate = useNavigate();
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
        customer,
        items,
        totalAmount,
      });
      toast.success('注文を確定しました');
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
    (s) => String(s.id) === customer.pickupStoreId,
  )?.name;

  return (
    <>
      <div className="flex">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>単価</TableHead>
              <TableHead>小計</TableHead>
            </TableRow>
          </TableHeader>
          {items.map((item) => (
            <TableBody className="border-b" key={item.id}>
              <TableRow>
                <TableCell className="w-25">
                  {item.image ? (
                    <img
                      className="h-20 w-20 shrink rounded-md object-cover"
                      src={`http://localhost/storage/${item.image}`}
                      alt={item.name}
                    />
                  ) : (
                    <div className="h-20 w-20 shrink rounded-md object-cover">
                      Not Image
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}個</TableCell>
                <TableCell>¥{item.price}</TableCell>
                <TableCell>
                  ¥{(item.price * item.quantity).toLocaleString('ja-JP')}
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>

        <div className="mt-2 flex h-60 w-1/2 flex-col justify-between rounded border bg-gray-100">
          <div className="flex justify-between p-2">
            <p>商品小計({totalItem}点)</p>
            <p className="text-xl font-medium text-red-400">
              ¥{totalPrice.toLocaleString('ja-JP')}円
            </p>
          </div>
          <div className="flex flex-col p-2">
            <Button
              disabled={isSubmitting}
              onClick={() => {
                void handleConfirm();
              }}
              className="mb-1 h-15 w-full bg-rose-500 text-xl font-medium hover:bg-rose-800"
            >
              注文を確定する
            </Button>
            <Link to="/carts">
              <Button className="h-15 w-full bg-gray-500 text-xl font-medium hover:bg-gray-800">
                カートに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <p>お客様情報</p>
        <Label htmlFor="name" className="py-2">
          名前
        </Label>
        <Input name="name" value={customer.name} readOnly />
        <Label htmlFor="address" className="py-2">
          住所
        </Label>
        <Input name="address" value={customer.address} readOnly />
        <Label htmlFor="phone" className="py-2">
          電話番号
        </Label>
        <Input name="phone" value={customer.phone} readOnly />
        <p className="py-2">
          受取方法:{' '}
          <span className="font-black">
            {customer.deliveryType === 'pickup' ? '店舗受取' : '配達'}
          </span>
        </p>

        {customer.deliveryType === 'pickup' && (
          <div className="py-2">
            <p>
              受取店舗: <span className="font-black">{storeName}</span>
            </p>
          </div>
        )}

        {customer.deliveryType === 'delivery' && (
          <div>
            <Label className="py-2" id="deliveryPostalCode">
              郵便番号
            </Label>
            <Input value={customer.deliveryPostalCode} readOnly />
            <Label className="py-2" id="deliveryAddress">
              配達先住所
            </Label>
            <Input value={customer.deliveryAddress} readOnly />
          </div>
        )}
        <Label className="py-2" id="note">
          備考
        </Label>
        <Textarea disabled value={customer.note}></Textarea>
      </div>
    </>
  );
}

export default Confirm;
