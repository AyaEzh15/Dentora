import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clinicalApi } from '@/features/patients/api/clinicalApi'

export function useMedicalRecord(patientId) {
  return useQuery({
    queryKey: ['medical-record', patientId],
    enabled: Boolean(patientId),
    queryFn: async () => {
      const { data } = await clinicalApi.getMedicalRecord(patientId)
      return data.data
    },
  })
}

export function useSaveMedicalRecord(patientId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => clinicalApi.saveMedicalRecord(patientId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medical-record', patientId] }),
  })
}

export function useOdontogram(patientId) {
  return useQuery({
    queryKey: ['odontogram', patientId],
    enabled: Boolean(patientId),
    queryFn: async () => {
      const { data } = await clinicalApi.getOdontogram(patientId)
      return data.data || []
    },
  })
}

export function useSaveOdontogram(patientId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => clinicalApi.saveOdontogram(patientId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['odontogram', patientId] }),
  })
}

export function useConsultations(params) {
  return useQuery({
    queryKey: ['consultations', params],
    queryFn: async () => {
      const { data } = await clinicalApi.getConsultations(params)
      return data.data
    },
  })
}

export function useSaveConsultation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? clinicalApi.updateConsultation(id, payload) : clinicalApi.createConsultation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

export function useTreatmentPlans(params) {
  return useQuery({
    queryKey: ['treatment-plans', params],
    queryFn: async () => {
      const { data } = await clinicalApi.getTreatmentPlans(params)
      return data.data
    },
  })
}

export function useSaveTreatmentPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? clinicalApi.updateTreatmentPlan(id, payload) : clinicalApi.createTreatmentPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
