import api from '@/api/axios'
import { endpoints } from '@/api/endpoints'

export const clinicalApi = {
  getMedicalRecord: (patientId) => api.get(endpoints.clinical.medicalRecord(patientId)),
  saveMedicalRecord: (patientId, payload) => api.put(endpoints.clinical.medicalRecord(patientId), payload),
  getOdontogram: (patientId) => api.get(endpoints.clinical.odontogram(patientId)),
  saveOdontogram: (patientId, payload) => api.put(endpoints.clinical.odontogram(patientId), payload),
  getConsultations: (params) => api.get(endpoints.clinical.consultations, { params }),
  createConsultation: (payload) => api.post(endpoints.clinical.consultations, payload),
  updateConsultation: (id, payload) => api.put(endpoints.clinical.consultation(id), payload),
  getTreatmentPlans: (params) => api.get(endpoints.clinical.treatmentPlans, { params }),
  createTreatmentPlan: (payload) => api.post(endpoints.clinical.treatmentPlans, payload),
  updateTreatmentPlan: (id, payload) => api.put(endpoints.clinical.treatmentPlan(id), payload),
}
