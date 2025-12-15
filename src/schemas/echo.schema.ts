import { z } from 'zod'

export const EchoBodySchema = z.object({
    message: z.string().min(1),
})

export const EchoQuerySchema = z.object({
    times: z.coerce.number().int().min(1).max(10).optional(),
})
