import { Router } from 'express'
import {
    validateBody,
    validateQuery,
    validateParams,
} from '../middlewares/validate.js'
import {
    EchoBodySchema,
    EchoQuerySchema,
} from '../schemas/echo.schema.js'
import { z } from 'zod'

const router = Router()

// GET /echo?message=hi&times=3
const EchoGetQuerySchema = z.object({
    message: z.string().min(1),
    times: z.coerce.number().int().min(1).max(10).optional(),
})

router.get(
    '/',
    validateQuery(EchoGetQuerySchema),
    (req, res) => {
        const { message, times } = req.query as any
        const count = times ?? 1

        res.json({
            echoed: Array.from({ length: count }, () => message).join(' '),
        })
    }
)

// POST /echo
router.post(
    '/',
    validateBody(EchoBodySchema),
    (req, res) => {
        res.json({
            echoed: (req.body as any).message,
        })
    }
)

// GET /echo/:id
const EchoParamsSchema = z.object({
    id: z.string().min(1),
})

router.get(
    '/:id',
    validateParams(EchoParamsSchema),
    (req, res) => {
        res.json({
            id: (req.params as any).id,
        })
    }
)

export default router
