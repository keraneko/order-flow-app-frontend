import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getProducts } from '@/api/products';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/cart/useCart';
import { type Product } from '@/types/product';
import { formatYen } from '@/utils/formatYen';

function CartProducts() {
  const navigate = useNavigate();
  const { addItem, items, totalItem, totalPrice } = useCart();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;

    addItem({
      ...product,
      quantity: quantity,
    });
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const visibleProducts = products.filter((p) => p.isVisible);

  useEffect(() => {
    getProducts()
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2 className="py-4 text-lg font-bold">商品一覧</h2>
      <div className="grid w-full grid-cols-3 gap-3">
        {visibleProducts.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden p-0">
            {/* 画像 */}
            <div className="relative flex h-44 items-center justify-center bg-gray-50">
              {item.image ? (
                <img
                  src={`http://localhost/storage/${item.image}`}
                  alt={item.name}
                  className={`h-44 w-full object-contain ${!item.isActive ? 'opacity-60 grayscale' : ''}`}
                />
              ) : (
                <span className="text-sm text-gray-400">画像なし</span>
              )}

              {!item.isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded bg-black/70 px-3 py-1 text-sm font-bold text-white">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>

            {/* 商品情報 */}
            <div className="px-3 py-2">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.price}円</p>
            </div>

            {/* 数量 + カートボタン */}
            <div className="mt-auto flex items-center gap-2 p-3 pt-0">
              <select
                className="h-9 w-20 rounded-xl border bg-amber-50 px-2 text-sm"
                name="quantity"
                id="quantity"
                value={quantities[item.id] || 1}
                onChange={(e) =>
                  handleQuantityChange(item.id, Number(e.target.value))
                }
              >
                {[...Array(30).keys()].map((index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>

              <Button
                onClick={() => {
                  if (!item.isActive) return;
                  addToCart(item);
                }}
                disabled={!item.isActive}
                className={`flex-1 rounded-xl ${
                  item.isActive
                    ? 'bg-amber-700 hover:bg-amber-800'
                    : 'cursor-not-allowed bg-gray-300'
                }`}
              >
                {item.isActive ? 'カートに入れる' : 'SOLD OUT'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {/* cart */}
      {items.length > 0 && (
        <div className="fixed right-0 bottom-0 left-0 z-20 border-t bg-white shadow-lg">
          <div className="mx-auto max-w-4xl px-4 py-3">
            {/* カート内商品チップ */}
            <div className="mb-2 flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800"
                >
                  {item.name} × {item.quantity}
                </span>
              ))}
            </div>

            {/* 合計 + ボタン */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-700">
                  {totalItem}点 {formatYen(totalPrice)}
                </p>
                <p className="text-xs text-gray-400">
                  カートで内容を確認・変更できます
                </p>
              </div>
              <Button
                className="rounded-xl bg-amber-700 px-6 hover:bg-amber-800"
                onClick={() => void navigate('/order/cartList')}
              >
                カートを確認する →
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartProducts;
