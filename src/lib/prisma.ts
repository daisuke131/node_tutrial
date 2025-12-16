import { PrismaClient } from '@prisma/client'

// Prisma 7では、prisma.config.tsで設定を管理
export const prisma = new PrismaClient()
