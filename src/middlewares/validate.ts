import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'

// リクエストボディをバリデーションするミドルウェア
export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}

// URLパラメータをバリデーションするミドルウェア
export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any
      next()
    } catch (error) {
      next(error)
    }
  }
}
