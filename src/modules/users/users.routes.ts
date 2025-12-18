import { Router } from 'express'
import { prisma } from '../../shared/infra/db.js'
import { UsersRepository } from './users.repository.js'
import { UsersService } from './users.service.js'
import { UsersController } from './users.controller.js'

// Dependency Injection Setup
// In a larger app, this would be handled by a DI container (e.g., InversifyJS, NestJS)
const usersRepository = new UsersRepository(prisma)
const usersService = new UsersService(usersRepository)
const usersController = new UsersController(usersService)

const usersRouter = Router()

usersRouter.post('/', usersController.create)
usersRouter.get('/', usersController.getAll)
usersRouter.get('/:id', usersController.getOne)
usersRouter.patch('/:id', usersController.update)
usersRouter.delete('/:id', usersController.remove)

export default usersRouter
