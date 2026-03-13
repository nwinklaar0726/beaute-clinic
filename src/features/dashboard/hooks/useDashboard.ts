import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

export interface DashboardStats {
  todayAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => api.get<DashboardStats>('/api/dashboard/stats'),
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}
