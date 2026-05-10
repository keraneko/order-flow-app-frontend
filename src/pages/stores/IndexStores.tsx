import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getStores } from '@/api/stores';
import { Button } from '@/components/ui/button';
import { type Store } from '@/types/store';

function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStores()
      .then((data: Store[]) => {
        setStores(data);
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
    <div className="flex flex-col gap-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">店舗一覧</h2>
        <Link to="/stores/new">
          <Button className="rounded-xl bg-amber-700 hover:bg-amber-800">
            店舗を登録する
          </Button>
        </Link>
      </div>

      {/* 店舗カード */}
      <div className="grid grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm"
          >
            {/* 店舗名 */}
            <div className="flex items-start justify-between">
              <p className="font-semibold">{store.name}</p>
              {!store.isActive && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                  非公開
                </span>
              )}
            </div>

            {/* 店舗コード */}
            {store.code && (
              <p className="text-xs text-gray-400">コード：{store.code}</p>
            )}

            {/* 住所 */}
            <p className="text-sm text-gray-500">
              {store.prefecture}
              {store.city}
              {store.addressLine}
            </p>

            {/* 編集リンク */}
            <div className="mt-auto pt-2">
              <Link to={`/stores/${store.id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl hover:border-amber-700 hover:text-amber-700"
                >
                  詳細確認・編集
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoresPage;
