import useSWR from 'swr';
import { api } from '@/lib/api';
import { Layout } from '@/lib/types';

export type LayoutStatusFilter = 'active' | 'all';

export function useLayouts(statusFilter: LayoutStatusFilter = 'active') {
  const endpoint = statusFilter === 'all' ? '/layouts?status=all' : '/layouts';

  return useSWR<Layout[]>(['layouts', statusFilter], () => api.get<Layout[]>(endpoint), {
    revalidateOnFocus: false,
  });
}
