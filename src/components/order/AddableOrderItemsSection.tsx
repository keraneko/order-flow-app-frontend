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
import type { OrderItemsCandidateProduct } from '@/types/product';
import { formatYen } from '@/utils/formatYen';

interface AddableOrderItemsSectionProps {
  filteredProducts: OrderItemsCandidateProduct[];
  draftQuantities: Record<number, number>;
  handleDraftChange: (productId: number, quantity: number) => void;
  handleAddProduct: (product: OrderItemsCandidateProduct) => void;
}

export default function AddableOrderItemsSection({
  filteredProducts,
  draftQuantities,
  handleDraftChange,
  handleAddProduct,
}: AddableOrderItemsSectionProps) {
  return (
    <>
      <div className="my-2 flex">
        <span className="text- border-b text-base font-bold">
          追加可能な注文
        </span>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-blue-50 hover:bg-blue-50">
            <TableHead className="text-shadow-accent-foreground">
              商品名
            </TableHead>
            <TableHead className="">単価</TableHead>
            <TableHead>数量</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-transparent">
              <TableCell className="">{product.name}</TableCell>
              <TableCell>{formatYen(product.price)}</TableCell>
              <TableCell>
                {/* onBlurで後日調整 */}
                <Input
                  type="number"
                  className="w-13 text-center"
                  value={draftQuantities[product.id] ?? 1}
                  onChange={(e) =>
                    handleDraftChange(product.id, Number(e.target.value))
                  }
                />
                <span className="ml-2">個</span>
              </TableCell>
              <TableCell>
                <div>
                  <Button
                    type="button"
                    onClick={() => handleAddProduct(product)}
                  >
                    追加する
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
