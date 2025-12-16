import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

// エラーハンドリングミドルウェア
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err)

  // Zodバリデーションエラー
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // Prismaエラー
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // ユニーク制約違反
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Unique constraint violation',
        message: 'A record with this value already exists',
      })
    }

    // レコードが見つからない
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested record was not found',
      })
    }

    // 外部キー制約違反
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'Foreign key constraint violation',
        message: 'Referenced record does not exist',
      })
    }
  }

  // その他のエラー
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  })
}
