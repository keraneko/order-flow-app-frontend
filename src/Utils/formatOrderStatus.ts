import type { OrderStatus } from '@/types/Order';

const assertUnreachable = (x: never): never => {
  throw new Error(`Unknown order status: ${String(x)}`);
};

export const formatOrderStatus = (status: OrderStatus): string => {
  switch (status) {
    case 'received':
      return '受注';
    case 'canceled':
      return 'キャンセル';
    case 'completed':
      return '取引完了';
    default:
      return assertUnreachable(status);
  }
};
