// src/middlewares/validate.ts
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

type Schema = z.ZodType

function makeValidate(
    getter: (req: Request) => unknown,
    setter: (req: Request, value: unknown) => void
) {
    return (schema: Schema) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse(getter(req))

            if (!result.success) {
                return next(result.error)
            }

            setter(req, result.data)
            next()
        }
}

export const validateBody = makeValidate(
    (req) => req.body,
    (req, value) => {
        req.body = value
    }
)

export const validateQuery = makeValidate(
    (req) => req.query,
    (req, value) => {
        req.query = value as any
    }
)

export const validateParams = makeValidate(
    (req) => req.params,
    (req, value) => {
        req.params = value as any
    }
)
