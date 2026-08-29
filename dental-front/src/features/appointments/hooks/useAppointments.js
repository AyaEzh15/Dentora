import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentApi } from '@/features/appointments/api/appointmentApi'

export function useAppointments(params) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const { data } = await appointmentApi.getAll(params)
      return data.data
    },
  })
}

export function useAppointmentCalendar(params) {
  return useQuery({
    queryKey: ['appointments', 'calendar', params],
    queryFn: async () => {
      const { data } = await appointmentApi.calendar(params)
      return data.data
    },
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => appointmentApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => appointmentApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }) => appointmentApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
