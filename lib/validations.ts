import { z } from 'zod'

export const archiveSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire").max(255),
  reference: z.string().max(100).nullable().optional(),
  documentType: z.string().min(1, "Le type de document est obligatoire"),
  category: z.string().min(1, "La catégorie est obligatoire"),
  department: z.string().min(1, "Le service est obligatoire"),
  author: z.string().max(255).nullable().optional(),

  documentDate: z.coerce.date().nullable().optional(),
  archivedAt: z.coerce.date(),
  expirationDate: z.coerce.date().nullable().optional(),

  confidentiality: z
    .string()
    .min(1, "Le niveau de confidentialité est obligatoire"),
  keywords: z.string().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  physicalLocation: z.string().max(500).nullable().optional(),

  status: z.enum(["ACTIF", "ARCHIVE", "EXPIRE", "SUPPRIME"]),
})

export const searchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  department: z.string().optional(),
  documentType: z.string().optional(),
  status: z.string().optional(),
  confidentiality: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional()
})

export type ArchiveInput = z.infer<typeof archiveSchema>
export type SearchInput = z.infer<typeof searchSchema>