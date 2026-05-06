import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Home() {
  const navigate = useNavigate();
  const { data: user, isPending } = useCurrentUser();
  const isAdmin = user?.role === 'admin';
  const isStoreUser = user?.role === 'store_user';

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8">
      {/* タイトル */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-amber-700">OrderFlow</h1>
        <p className="mt-1 text-sm text-gray-400">
          お弁当・仕出し注文管理システム
        </p>
      </div>

      {/* 未ログイン */}
      {!user && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500">続けるにはログインが必要です</p>
          <Button
            className="rounded-xl bg-amber-700 px-8 hover:bg-amber-800"
            onClick={() => void navigate('/login')}
          >
            ログインへ
          </Button>
        </div>
      )}

      {/* admin */}
      {isAdmin && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">管理者メニュー</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '注文一覧', path: '/orders' },
              { label: '商品管理', path: '/products' },
              { label: '店舗管理', path: '/stores' },
            ].map(({ label, path }) => (
              <Button
                key={path}
                variant="outline"
                className="h-20 w-32 flex-col rounded-xl border-amber-200 hover:border-amber-700 hover:text-amber-700"
                onClick={() => void navigate(path)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* storeUser */}
      {isStoreUser && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">メニュー</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '注文を作成する', path: '/order/options' },
              { label: '注文一覧', path: '/orders' },
            ].map(({ label, path }) => (
              <Button
                key={path}
                variant="outline"
                className="h-20 w-36 rounded-xl border-amber-200 hover:border-amber-700 hover:text-amber-700"
                onClick={() => void navigate(path)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
