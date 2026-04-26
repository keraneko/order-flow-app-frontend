import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/axios';
import type { OrderShow } from '@/types/order';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';

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

        if (status === 403) {
          return toast.error(
            '現在のユーザーでこの注文を更新する権限がありません',
          );
        }

        if (status === 422) {
          return toast.error(
            getFirstAxiosValidationMessage(e.response?.data) ??
              '入力内容が間違っています',
          );
        }

        return toast.error('更新に失敗しました');
      }
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
        {/* 編集ボタン */}
        <div className="pr-4 text-right">
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}>
              <Badge variant="outline">編集</Badge>
            </button>
          )}
          {isEditing && (
            <div className="flex justify-end">
              <button className="mr-2" disabled={isSubmitting} type="submit">
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
        <div>
          <Label className="p-2 text-gray-500">配送先住所:</Label>
          <div className="p-2">
            <Label className="text-xs text-gray-500">郵便番号:</Label>
            <Input
              disabled={!isEditing}
              className="py-1"
              value={
                inputDeliveryPostalCode !== undefined
                  ? inputDeliveryPostalCode
                  : ''
              }
              name="deliveryPostalCode"
              onChange={handleChange}
            />
          </div>
          <div className="p-2">
            <Label className="text-xs text-gray-500">住所:</Label>
            <Input
              disabled={!isEditing}
              className="flex-1 py-1"
              value={
                inputDeliveryAddress !== undefined ? inputDeliveryAddress : ''
              }
              name="deliveryAddress"
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </>
  );
}
