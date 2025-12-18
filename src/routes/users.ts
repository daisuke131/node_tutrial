import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { validateBody } from '../middlewares/validate.js'
import { createUserSchema } from '../schemas/user.schema.js'

const router = Router()

// ユーザー作成（POST /users）
router.post('/', validateBody(createUserSchema), async (req, res, next) => {
  try {
    const { email, name } = req.body

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

// 全ユーザー取得（GET /users）
router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

export default router
