import type { OrderStatus } from '@/types/order';
import { formatOrderStatus } from '@/utils/formatOrderStatus';

import { Badge } from '../ui/badge';

interface props {
  status: OrderStatus;
}

const variantByStatus: Record<
  OrderStatus,
  React.ComponentProps<typeof Badge>['variant']
> = {
  received: 'outline',
  completed: 'default',
  canceled: 'destructive',
};

function OrderStatusBadge({ status }: props) {
  return (
    <Badge variant={variantByStatus[status]}>{formatOrderStatus(status)}</Badge>
  );
}

export default OrderStatusBadge;
