import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentApi } from '@/features/payments/api/paymentApi'

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Espèces' },
  { value: 'CARD', label: 'Carte' },
  { value: 'CHECK', label: 'Chèque' },
  { value: 'TRANSFER', label: 'Virement' },
]

export function usePayments(params) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const { data } = await paymentApi.getAll(params)
      return data.data
    },
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => paymentApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
