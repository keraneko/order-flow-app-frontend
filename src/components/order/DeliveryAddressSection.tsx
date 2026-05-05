import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/axios';
import type { OrderShow } from '@/types/order';
import {
  getAxiosMessage,
  getFirstAxiosValidationMessage,
} from '@/utils/apiError';

import { Badge } from '../ui/badge';

interface DeliveryAddressSectionProps {
  order: OrderShow;
  orderId: number;
}

interface DeliveryAddressForm {
  deliveryPostalCode?: string;
  deliveryAddress?: string;
}

export default function DeliveryAddressSection({
  order,
  orderId,
}: DeliveryAddressSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftDeliveryAddress, setDraftDeliveryAddress] =
    useState<DeliveryAddressForm | null>(null);

  const inputDeliveryPostalCode =
    draftDeliveryAddress?.deliveryPostalCode ?? order.deliveryPostalCode;

  const inputDeliveryAddress =
    draftDeliveryAddress?.deliveryAddress ?? order.deliveryAddress;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraftDeliveryAddress((prev) => ({
      ...(prev ?? {}),
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const buildPayload = () => {
      if (order.deliveryType === 'delivery') {
        const deliveryPayload = {
          delivery_postal_code:
            draftDeliveryAddress?.deliveryPostalCode ??
            order.deliveryPostalCode,
          delivery_address:
            draftDeliveryAddress?.deliveryAddress ?? order.deliveryAddress,
        };

        return deliveryPayload;
      }
    };

    try {
      await apiClient.patch(
        `/api/orders/${orderId}/destination`,
        buildPayload(),
      );

      toast.success('変更しました');
      await queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
        exact: true,
      });
      setIsEditing(false);
      setDraftDeliveryAddress(null);
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="pb-3">
        {/* 編集ボタン */}
        <div className="flex items-center justify-end py-1 pr-1">
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
              <button
                disabled={isSubmitting}
                type="submit"
                className={isSubmitting ? 'opacity-40' : ''}
              >
                <Badge variant="outline">保存</Badge>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setDraftDeliveryAddress(null);
                }}
              >
                <Badge variant="destructive">中止</Badge>
              </button>
            </div>
          )}
        </div>

        {/* 配送先住所 */}
        <div className="flex flex-col gap-3 px-2 py-1">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-gray-500">郵便番号</Label>
            <Input
              disabled={!isEditing}
              value={inputDeliveryPostalCode ?? ''}
              name="deliveryPostalCode"
              onChange={handleChange}
              className="rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-gray-500">住所</Label>
            <Input
              disabled={!isEditing}
              value={inputDeliveryAddress ?? ''}
              name="deliveryAddress"
              onChange={handleChange}
              className="rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
