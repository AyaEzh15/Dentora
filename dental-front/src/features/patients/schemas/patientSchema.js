import { z } from 'zod'

export const patientSchema = z.object({
  first_name: z.string().min(2, 'Le prénom est obligatoire.'),
  last_name: z.string().min(2, 'Le nom est obligatoire.'),
  email: z.string().email('E-mail invalide.').optional().or(z.literal('')),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  cin: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  medical_alert: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
})
