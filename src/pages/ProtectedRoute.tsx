import { Navigate, Outlet } from 'react-router';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function ProtectedRoute() {
  const { data, isPending, isError } = useCurrentUser();

  if (isPending) return <span>認証確認中...</span>;

  if (isError) return <Navigate replace to="/login" />;

  if (!data) return <Navigate replace to="/login" />;

  return <Outlet />;
}
