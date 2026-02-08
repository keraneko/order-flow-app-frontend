import { useEffect, useState } from 'react';
import { getProducts } from '@/api/products';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/cart/useCart';
import { type Product } from '@/types/product';

function Home() {
  const { addItem } = useCart();
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
      <h2>商品一覧ページ</h2>
      <div className="grid w-full grid-cols-3 gap-2">
        {visibleProducts.map((item) => (
          <Card key={item.id} className="flex h-80 flex-col p-0">
            <div className="relative m-auto">
              {item.image ? (
                <img
                  src={`http://localhost/storage/${item.image}`}
                  alt={item.name}
                  className={`h-44 rounded bg-gray-100 object-contain ${!item.isActive ? 'opacity-60 grayscale' : ''}`}
                />
              ) : (
                <div>Not Image</div>
              )}

              {!item.isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded bg-black/70 px-3 py-1 text-sm font-bold text-white">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between p-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.price}円</p>
            </div>
            <div className="flex p-2">
              <select
                className="m-auto h-full w-20 rounded border bg-amber-50"
                name="quanity"
                id="quanity"
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
                className={
                  !item.isActive
                    ? 'mt-auto bg-gray-400'
                    : 'mt-auto bg-amber-400'
                }
                disabled={!item.isActive}
              >
                {!item.isActive ? 'SOLD OUT' : 'カートに入れる'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Home;
