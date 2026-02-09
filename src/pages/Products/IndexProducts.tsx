import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getProducts } from '@/api/products';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card';
import { type Product } from '@/types/product';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';

type VisibilityFilter = 'visible' | 'hidden' | 'all';

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<VisibilityFilter>('visible');
  const [submittingIds, setSubmittingIds] = useState<Record<number, boolean>>(
    {},
  );

  const handleRestore = async (id: number, nextvisible: boolean) => {
    if (submittingIds[id]) return;

    setSubmittingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ is_active: nextvisible }),
      });

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(await getFirstValidationMessage(res));

          return;
        }
        toast.error('更新に失敗しました');

        return;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: nextvisible } : p)),
      );

      toast.success('更新しました');
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'visible') return p.isVisible === true;

    if (filter === 'hidden') return p.isVisible === false;

    return true;
  });

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
      <div className="flex items-center justify-between py-2">
        <h2>商品一覧ページ</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as VisibilityFilter)}
          className="rounded border px-2 py-1"
        >
          <option value="visible">表示中</option>
          <option value="hidden">非表示</option>
          <option value="all">すべて</option>
        </select>
        <Link to={'/products/new'}>
          <Button className="bg-blue-400 text-xl">新規登録</Button>
        </Link>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {filteredProducts.map((item) => (
          <Card key={item.id} className="flex h-80 flex-col p-0">
            <div className="relative m-auto">
              {item.image ? (
                <img
                  src={`http://localhost/storage/${item.image}`}
                  alt={item.name}
                  className="h-44 rounded bg-gray-100 object-contain"
                />
              ) : (
                <div>Not Image</div>
              )}
            </div>
            <div className="flex justify-between p-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.price}円</p>
              {/* {item.isActive ?
                    <p className="border bg-blue-400 rounded text-white text-base">販売中</p> :
                    <p className="border bg-red-400 rounded text-white text-base">販売停止中</p>} */}
            </div>
            <div className="flex justify-between">
              <Button
                className="m-2"
                onClick={() => void navigate(`/products/${item.id}/edit`)}
              >
                編集する
              </Button>

              <Button
                className={`mt-2 ${item.isActive ? 'bg-red-400' : 'bg-blue-400'}`}
                onClick={() => {
                  void handleRestore(item.id, !item.isActive);
                }}
                disabled={!!submittingIds[item.id]}
              >
                {item.isActive ? '販売停止にする' : '販売中にする'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default ProductsPage;
