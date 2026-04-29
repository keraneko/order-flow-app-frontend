import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, type UserRole } from '@/api/auth';

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { data: user, isPending } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });

  if (isPending) return <p>読み込み中...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.role || !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;

  return <>{children}</>;
}
