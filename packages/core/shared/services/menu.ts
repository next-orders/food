import { z } from 'zod'

export const menuCreateSchema = z.object({
  name: z.string().min(2).max(50),
})

export type MenuCreateSchema = z.output<typeof menuCreateSchema>

export const menuUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  isActive: z.boolean().optional(),
})

export const menuCategoryCreateSchema = z.object({
  name: z.string().min(2).max(50),
  menuId: z.string(),
})

export type MenuCategoryCreateSchema = z.output<typeof menuCategoryCreateSchema>

export const menuCategoryUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  slug: z.string().min(2).max(50).optional(),
})

export type MenuCategoryUpdateSchema = z.output<typeof menuCategoryUpdateSchema>
