import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    DATABASE_URL: z.string().url().min(1),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

const envResult = envSchema.safeParse(process.env)

if (!envResult.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(envResult.error.format(), null, 2))
    process.exit(1)
}

export const config = envResult.data
