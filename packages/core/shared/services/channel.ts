import { z } from 'zod'
import { locale } from './locale'

export const channelCreateSchema = z.object({
  name: z.string().min(2).max(75),
  currencyCode: z.string().max(3),
  countryCode: z.string().max(3),
  defaultLocale: z.string().max(5),
  timeZone: z.string().max(6),
})

export type ChannelCreateSchema = z.output<typeof channelCreateSchema>

export const channelUpdateSchema = z.object({
  locale,
  name: z.string().min(2).max(75).optional(),
  description: z.string().min(0).max(150).optional(),
  phone: z.string().max(20).optional(),
  currencyCode: z.string().max(3).optional(),
  countryCode: z.string().max(3).optional(),
  defaultLocale: z.string().max(5).optional(),
  timeZone: z.string().max(6).optional(),
  minAmountForDelivery: z.number().optional(),
  conditions: z.string().max(750).optional(),
})

export type ChannelUpdateSchema = z.output<typeof channelUpdateSchema>

export const channelReceivingMethodUpdateSchema = z.object({
  method: z.enum(['PICKUP', 'DELIVERY']),
})

export const channelPaymentMethodCreateSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(['CASH', 'CARD', 'CUSTOM']),
})

export type ChannelPaymentMethodCreateSchema = z.output<typeof channelPaymentMethodCreateSchema>

export const channelPaymentMethodUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
})

export type ChannelPaymentMethodUpdateSchema = z.output<typeof channelPaymentMethodUpdateSchema>
