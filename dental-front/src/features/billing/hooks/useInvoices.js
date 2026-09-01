import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invoiceApi } from '@/features/billing/api/invoiceApi'

export function invoiceStatusTone(status) {
  if (status === 'PAID') return 'success'
  if (status === 'PARTIALLY_PAID') return 'warning'
  if (status === 'ISSUED') return 'info'
  if (status === 'CANCELLED') return 'error'
  return 'muted'
}

export function useInvoices(params, options = {}) {
  return useQuery({
    queryKey: ['invoices', params],
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const { data } = await invoiceApi.getAll(params)
      return data.data
    },
  })
}

export function useSaveInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => (id ? invoiceApi.update(id, payload) : invoiceApi.create(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
