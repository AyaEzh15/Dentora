import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'identifiant est obligatoire.")
    .email("L'adresse e-mail n'est pas valide."),
  password: z.string().min(1, 'Le mot de passe est obligatoire.'),
  remember: z.boolean().optional(),
})
