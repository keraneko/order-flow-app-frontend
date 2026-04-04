import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { OrderCustomerEdit } from '@/types/customer';
import type { OrderShow } from '@/types/order';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface OrderCustomerProps {
  order: OrderShow;
  orderId: number;
}

export default function OrderCustomer({ order, orderId }: OrderCustomerProps) {
  const queryClient = useQueryClient();
  const [draftCustomer, setDraftCustomer] = useState<OrderCustomerEdit | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerName = draftCustomer?.name ?? order.customer.name;
  const customerPhone = draftCustomer?.phone ?? order.customer.phone;
  const customerAddress = draftCustomer?.address ?? order.customer.address;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: customerName,
        address: customerAddress,
        phone: customerPhone,
      };

      const res = await fetch(`/api/orders/${orderId}/customer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(getFirstValidationMessage(res));
        }

        return;
      }
      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setIsEditing(false);
      setDraftCustomer(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '更新に失敗しました';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as 'name' | 'phone' | 'address';

    const customerEdit: OrderCustomerEdit = {
      name: order.customer.name,
      phone: order.customer.phone,
      address: order.customer.address,
    };

    setDraftCustomer((prev) => {
      if (prev === null) {
        return {
          ...customerEdit,
          [field]: value,
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return (
    <>
      <div className="rounded-sm border">
        <div className="flex items-center justify-between border-b">
          <Label className="flex h-10 items-center pl-4 font-semibold">
            顧客情報
          </Label>

          <div className="pr-4">
            {!isEditing && (
              <button type="button" onClick={() => setIsEditing(true)}>
                <Badge variant="outline">編集</Badge>
              </button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button disabled={isSubmitting}>
                      <Badge variant="outline">
                        {isSubmitting ? '保存中...' : '保存'}
                      </Badge>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        データを更新しますか？
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        顧客情報は共通の顧客データとして管理されています。更新すると他の注文にも影響する可能性があります。保存しますか？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          void handleSubmit();
                        }}
                      >
                        変更を保存する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDraftCustomer(null);
                  }}
                >
                  <Badge variant="destructive">中止</Badge>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-around">
          <div className="flex items-start border-b p-2">
            <User className="text-muted-foreground mx-4 mt-3 h-5 w-5 shrink-0" />
            <div className="flex w-full flex-col gap-2 p-2">
              <Input
                name="name"
                value={customerName ? customerName : ''}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="名前"
              />
              <Input
                name="address"
                value={customerAddress ? customerAddress : ''}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="住所"
              />
            </div>
          </div>
          <div className="flex items-center p-2">
            <Phone className="text-muted-foreground mx-4 h-5 w-5 shrink-0" />
            <div className="flex-1 px-2">
              <Input
                name="phone"
                value={customerPhone ? customerPhone : ''}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="電話番号"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
