import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patientApi } from '@/features/patients/api/patientApi'

export function usePatients(params) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      const { data } = await patientApi.getAll(params)
      return data.data
    },
  })
}

export function usePatient(id) {
  return useQuery({
    queryKey: ['patients', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await patientApi.getById(id)
      return data.data
    },
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => patientApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdatePatient(id) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => patientApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
