import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { prescriptionApi } from '@/features/prescriptions/api/prescriptionApi'

export function usePrescriptions(params, options = {}) {
  return useQuery({
    queryKey: ['prescriptions', params],
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const { data } = await prescriptionApi.getAll(params)
      return data.data
    },
  })
}

export function useSavePrescription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => (id ? prescriptionApi.update(id, payload) : prescriptionApi.create(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
