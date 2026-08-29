import { z } from 'zod'

export const careTypeSchema = z.object({
  name: z.string().min(2, 'Le nom du soin est obligatoire.'),
  sort_order: z.union([z.literal(''), z.coerce.number().int().min(1)]).optional(),
  is_active: z.boolean().optional(),
})
