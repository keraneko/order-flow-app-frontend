import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { getProducts } from '@/api/products';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/axios';
import { type Product } from '@/types/product';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';

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

  const handleUpdateSalesStatus = async (id: number, nextActive: boolean) => {
    if (submittingIds[id]) return;

    setSubmittingIds((prev) => ({ ...prev, [id]: true }));
    try {
      await apiClient.patch(`/api/products/${id}/sales-status`, {
        is_active: nextActive,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: nextActive } : p)),
      );

      toast.success('更新しました');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 403) {
          return toast.error(
            '現在のユーザーでこの商品を更新する権限がありません',
          );
        }

        if (status === 422) {
          return toast.error(
            getFirstAxiosValidationMessage(e.response?.data) ??
              '更新に失敗しました',
          );
        }

        return toast.error('更新に失敗しました');
      }

      return toast.error('更新に失敗しました');
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
          <Button className="bg-blue-500 text-xl hover:bg-blue-600">
            新規登録
          </Button>
        </Link>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {filteredProducts.map((item) => (
          <Card key={item.id} className="flex flex-col p-0">
            {/* 画像 */}
            <div className="flex h-44 items-center justify-center rounded-t-xl bg-gray-50">
              {item.image ? (
                <img
                  src={`http://localhost/storage/${item.image}`}
                  alt={item.name}
                  className="h-44 w-full rounded-t-xl object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400">画像なし</span>
              )}
            </div>

            {/* 商品情報 */}
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.price}円</p>
            </div>

            <div className="mt-auto flex justify-between gap-2 p-3 pt-0">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => void navigate(`/products/${item.id}/edit`)}
              >
                編集
              </Button>
              <Button
                className={`flex-1 rounded-xl ${item.isActive ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={() =>
                  void handleUpdateSalesStatus(item.id, !item.isActive)
                }
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
