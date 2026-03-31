import PickupStoreSection from '@/components/order/PickupStoreSection';
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
    <>
      <div className="mt-5 rounded-sm border">
        <div className="flex h-10 justify-between border-b px-4">
          <Label className="font-semibold">配送情報</Label>
        </div>

        {order.deliveryType === 'delivery' && (
          <div>
            <div className="p-2">
              {/* 配達時の責務 */}
              <ScheduleSection order={order} orderId={orderId} />
              <DeliveryAddressSection order={order} orderId={orderId} />
            </div>
          </div>
        )}
        {order.deliveryType === 'pickup' && order.pickupStore === null && (
          <Label className="p-2 text-sm text-red-400">
            店舗情報を取得できませんでした
          </Label>
        )}
        {order.deliveryType === 'pickup' && order.pickupStore !== null && (
          <div>
            {/* 店舗受け取り時の責務 */}
            <ScheduleSection order={order} orderId={orderId} />
            <PickupStoreSection order={order} orderId={orderId} />
          </div>
        )}
      </div>
    </>
  );
}
