import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/features/dashboard/api/dashboardApi'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await dashboardApi.get()
      return data.data
    },
  })
}
