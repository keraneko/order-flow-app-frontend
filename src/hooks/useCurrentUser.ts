import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/api/auth';

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

export function useCurrentUser() {
  return useQuery({
    ...currentUserQueryOptions(),
    retry: false,
  });
}
