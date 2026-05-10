import { Link } from 'react-router';
import { Pencil } from 'lucide-react';
import PickupStoreSection from '@/components/order/PickupStoreSection';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { OrderShow } from '@/types/order';

import DeliveryAddressSection from './DeliveryAddressSection';
import { ScheduleSection } from './ScheduleSection';

interface FulfillmentInfoCardProps {
  order: OrderShow;
  orderId: number;
}

export default function FulfillmentInfoCard({
  order,
  orderId,
}: FulfillmentInfoCardProps) {
  return (
    <div className="rounded-xl border">
      {/* ヘッダー */}
      <div className="flex h-10 items-center border-b px-4">
        <span className="font-semibold">受取先情報</span>
      </div>

      {/* 受渡情報 */}
      <div className="flex h-10 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-500">受渡情報:</Label>
          <span className="font-medium">
            {order.deliveryType === 'pickup' ? '来店' : '配達'}
          </span>
        </div>
        <Link
          to={`/orders/${order.id}/delivery-type/edit`}
          className={
            order.status !== 'received'
              ? 'pointer-events-none opacity-30 grayscale'
              : ''
          }
        >
          <Badge variant="outline" className="flex items-center gap-1">
            <Pencil className="h-3 w-3" />
            {order.deliveryType === 'delivery'
              ? '来店に変更する'
              : '配達に変更する'}
          </Badge>
        </Link>
      </div>

      {/* 配達 */}
      {order.deliveryType === 'delivery' && (
        <div className="p-2">
          <ScheduleSection order={order} orderId={orderId} />
          <DeliveryAddressSection order={order} orderId={orderId} />
        </div>
      )}

      {/* 店舗受取 */}
      {order.deliveryType === 'pickup' && order.pickupStore === null && (
        <p className="p-4 text-sm text-red-400">
          店舗情報を取得できませんでした
        </p>
      )}
      {order.deliveryType === 'pickup' && order.pickupStore !== null && (
        <div>
          <ScheduleSection order={order} orderId={orderId} />
          <PickupStoreSection order={order} orderId={orderId} />
        </div>
      )}
    </div>
  );
}
