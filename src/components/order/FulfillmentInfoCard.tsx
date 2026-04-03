import { Link } from 'react-router';
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
        <div className="flex h-10 border-b px-4">
          <Label className="font-semibold">受取先情報</Label>
        </div>
        <div className="flex h-10 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <Label className="p-2 text-gray-500">受渡情報:</Label>
            {order.deliveryType === 'pickup' && <p>来店</p>}
            {order.deliveryType === 'delivery' && <p>配達</p>}
          </div>
          <Link
            to={`/orders/${order.id}/delivery-type/edit`}
            className="border-b text-sm text-violet-600"
          >
            変更
          </Link>
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
