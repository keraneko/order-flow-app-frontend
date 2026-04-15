import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ListChevronsUpDown, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { logout } from '@/api/auth';
import { Button } from '@/components/ui/button.tsx';
import {
  currentUserQueryOptions,
  useCurrentUser,
} from '@/hooks/useCurrentUser';

export function PublicLayout() {
  const { data, isPending } = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/">
            <span className="text-lg font-bold text-amber-700">OrderFlow</span>
          </Link>
          <div className="flex items-center gap-3 text-gray-500">
            <ShoppingCart className="h-5 w-5 cursor-pointer transition-colors hover:text-amber-700" />
            <ListChevronsUpDown className="h-5 w-5 cursor-pointer transition-colors hover:text-amber-700" />

            <Link
              to={data ? '/orders' : '/login'}
              className={`text-xs text-gray-300 transition-colors hover:text-gray-400 ${
                isPending ? 'invisible' : 'visible'
              }`}
            >
              {data ? '管理画面へ' : '管理者'}
            </Link>
          </div>
        </div>
      </header>

      <nav className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <ul className="flex list-none gap-1 py-2">
            {[
              { to: '/order/options', label: 'オプション' },
              { to: '/order/cart', label: 'カート' },
              { to: '/order/customer', label: 'お客様情報' },
              { to: '/order/confirm', label: '確認' },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={
                        isActive ? 'bg-amber-700 hover:bg-amber-800' : ''
                      }
                      size="sm"
                    >
                      {label}
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-gray-400">
          © 2026 OrderFlow-App
        </div>
      </footer>
    </div>
  );
}

export function AdminLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: currentUserQueryOptions().queryKey,
      });
      toast.success('ログアウトしました');
      void navigate('/login');
    },
    onError: (e) => {
      const message =
        e instanceof Error ? e.message : 'ログアウトに失敗しました';
      toast.error(message);
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/orders">
            <span className="text-lg font-bold text-amber-700">
              OrderFlow管理
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{data?.name ?? ''}</span>
            <Button
              type="button"
              disabled={mutation.isPending}
              variant="outline"
              size="sm"
              className="rounded-xl text-gray-500"
              onClick={() => {
                mutation.mutate();
              }}
            >
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <nav className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <ul className="flex list-none gap-1 py-2">
            {[
              { to: '/orders', label: '注文一覧' },
              { to: '/products', label: '商品一覧' },
              { to: '/stores', label: '店舗一覧' },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={
                        isActive ? 'bg-amber-700 hover:bg-amber-800' : ''
                      }
                      size="sm"
                    >
                      {label}
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-gray-400">
          © 2026 OrderFlow-App
        </div>
      </footer>
    </div>
  );
}
