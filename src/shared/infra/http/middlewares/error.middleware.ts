import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { AppError } from '../../../errors/app-error.js'
import { errorResponse } from '../api-response.js'

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response, // eslint-disable-line @typescript-eslint/no-unused-vars
    next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
    console.error('[(ERROR)]', err)

    if (err instanceof AppError) {
        res.status(err.statusCode).json(errorResponse(err.message, err.code))
        return
    }

    if (err instanceof ZodError) {
        const formatted = err.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message
        }))
        res.status(400).json(errorResponse('Validation error', 'VALIDATION_ERROR', formatted))
        return
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (err.code === 'P2002') {
            const target = (err.meta?.target as string[]) || 'unknown field'
            res.status(409).json(errorResponse(`Unique constraint violation: ${target}`, 'CONFLICT_ERROR'))
            return
        }
        // P2025: Record not found
        if (err.code === 'P2025') {
            res.status(404).json(errorResponse('Record not found', 'NOT_FOUND'))
            return
        }
    }

    // Fallback for unexpected errors
    res.status(500).json(errorResponse('Internal server error', 'INTERNAL_SERVER_ERROR'))
}
