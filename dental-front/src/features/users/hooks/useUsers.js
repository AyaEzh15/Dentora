import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/features/users/api/userApi'

export function useUsers(params) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await userApi.getAll(params)
      return data.data
    },
  })
}

export function useDentists() {
  return useQuery({
    queryKey: ['users', 'dentists'],
    queryFn: async () => {
      const { data } = await userApi.dentists()
      return data.data
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => userApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser(id) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => userApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
