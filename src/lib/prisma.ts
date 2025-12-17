import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Prisma 7では、アダプターを使用して初期化
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })
