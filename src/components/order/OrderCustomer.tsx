import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/axios';
import type { OrderCustomerEdit } from '@/types/customer';
import type { OrderShow } from '@/types/order';
import {
  getAxiosMessage,
  getFirstAxiosValidationMessage,
} from '@/utils/apiError';

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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name: customerName,
        address: customerAddress,
        phone: customerPhone,
      };

      await apiClient.patch(`/api/orders/${orderId}/customer`, payload);

      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setIsEditing(false);
      setDraftCustomer(null);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const validationMessage = getFirstAxiosValidationMessage(
          e.response?.data,
        );
        const apiMessage = getAxiosMessage(e.response?.data);

        if (status === 403) {
          toast.error('現在のユーザーでこの注文を更新する権限がありません');

          return;
        }

        if (status === 422) {
          toast.error(
            validationMessage ?? apiMessage ?? '入力内容が間違っています',
          );

          return;
        }

        toast.error('更新に失敗しました');

        return;
      }
      toast.error('更新に失敗しました');
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
    <div className="rounded-xl border">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-semibold">顧客情報</span>

        <div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={order.status !== 'received'}
              className={
                order.status !== 'received'
                  ? 'cursor-not-allowed opacity-30 grayscale'
                  : 'cursor-pointer'
              }
            >
              <Badge variant="outline">編集</Badge>
            </button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isSubmitting}
                    className={isSubmitting ? 'opacity-40' : ''}
                  >
                    <Badge variant="outline">
                      {isSubmitting ? '保存中...' : '保存'}
                    </Badge>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>データを更新しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      顧客情報は共通の顧客データとして管理されています。更新すると他の注文にも影響する可能性があります。保存しますか？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void handleSubmit()}>
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

      {/* 名前・住所 */}
      <div className="flex items-start border-b p-2">
        <User className="text-muted-foreground mx-4 mt-3 h-5 w-5 shrink-0" />
        <div className="flex w-full flex-col gap-2 p-2">
          <Input
            name="name"
            value={customerName ?? ''}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder="名前"
            className="rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
          />
          <Input
            name="address"
            value={customerAddress ?? ''}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder="住所"
            className="rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      {/* 電話番号 */}
      <div className="flex items-center p-2">
        <Phone className="text-muted-foreground mx-4 h-5 w-5 shrink-0" />
        <div className="flex-1 px-2">
          <Input
            name="phone"
            value={customerPhone ?? ''}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder="電話番号"
            className="rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
