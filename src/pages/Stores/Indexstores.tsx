import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { getStores, type Store } from '@/types/Stores';

function StoresPage() {
  const [stores, setSores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStores()
      .then((data: Store[]) => {
        setSores(data);
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
        <h2>店舗情報</h2>
        <Link to={'/stores/new'}>
          <Button className="">店舗情報を登録する</Button>
        </Link>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {stores.map((store) => (
          <div key={store.id} className="flex h-80 flex-col p-0">
            <div className="flex justify-between p-1">
              <Link to={`/stores/${store.id}/edit`}>
                <p className="font-semibold text-blue-500 hover:text-blue-100">
                  {store.name}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default StoresPage;
