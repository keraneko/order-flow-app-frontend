import { type OrderShow } from '@/types/order';
import { formatYen } from '@/utils/formatYen';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface OrderItemsTableProps {
  order: OrderShow;
}

function OrderItemsTable({ order }: OrderItemsTableProps) {
  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-blue-50 hover:bg-blue-50">
            <TableHead className="">商品名</TableHead>
            <TableHead>数量</TableHead>
            <TableHead className="">単価</TableHead>
            <TableHead className="">小計</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.product.id} className="hover:bg-transparent">
              <TableCell className="">{item.product.name}</TableCell>
              <TableCell>{item.quantity}個</TableCell>
              <TableCell>{formatYen(item.unitPrice)}</TableCell>
              <TableCell className="">
                {formatYen(item.unitPrice * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} className="pr-4 text-right">
              合計 {formatYen(order.totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default OrderItemsTable;
