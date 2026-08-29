import { z } from 'zod'

export const userSchema = z.object({
  first_name: z.string().min(2, 'Le prénom est obligatoire.'),
  last_name: z.string().min(2, 'Le nom est obligatoire.'),
  email: z.string().email('E-mail invalide.'),
  phone: z.string().optional(),
  password: z.string().optional(),
  role: z.string().min(1, 'Le rôle est obligatoire.'),
  is_active: z.boolean().optional(),
})
