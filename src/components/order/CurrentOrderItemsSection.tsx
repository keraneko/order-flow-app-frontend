import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type OrderEditItem } from '@/types/order';
import { formatYen } from '@/utils/formatYen';

interface CurrentOrderItemsSectionProps {
  items: OrderEditItem[];
  totalPrice: number;
  handleChange: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
}

export default function CurrentOrderItemsSection({
  items,
  totalPrice,
  handleChange,
  removeItem,
}: CurrentOrderItemsSectionProps) {
  return (
    <>
      {items.length === 0 && (
        <div className="text-sm text-red-400">商品を選択してください</div>
      )}
      <div className="my-2 flex">
        <span className="border-b text-base font-bold">現在の注文内容</span>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-blue-50 hover:bg-blue-50">
            <TableHead className="">商品名</TableHead>
            <TableHead className="">単価</TableHead>
            <TableHead>数量</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productId} className="hover:bg-transparent">
              <TableCell className="">{item.productName}</TableCell>
              <TableCell>{formatYen(item.price)}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-13 text-center"
                  value={item.quantity}
                  onChange={(e) => {
                    handleChange(item.productId, Number(e.target.value));
                  }}
                />
                <span className="ml-2">個</span>
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    removeItem(item.productId);
                  }}
                >
                  削除する
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-2 py-1 text-right">
        <span className="border-b">
          <span className="mr-2">合計金額 </span>
          <span className="font-bold">{formatYen(totalPrice)}</span>
        </span>
      </div>
    </>
  );
}
