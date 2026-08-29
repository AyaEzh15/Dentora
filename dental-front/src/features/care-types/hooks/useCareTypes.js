import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { careTypeApi } from '@/features/care-types/api/careTypeApi'

export function useCareTypes() {
  return useQuery({
    queryKey: ['care-types'],
    queryFn: async () => {
      const { data } = await careTypeApi.getAll()
      return data.data || []
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useManageCareTypes(enabled = true) {
  return useQuery({
    queryKey: ['care-types', 'admin'],
    enabled,
    queryFn: async () => {
      const { data } = await careTypeApi.getAll({ all: 1 })
      return data.data || []
    },
  })
}

export function useCreateCareType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => careTypeApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['care-types'] }),
  })
}

export function useUpdateCareType(id) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => careTypeApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['care-types'] }),
  })
}
