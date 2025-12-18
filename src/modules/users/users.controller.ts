import type { Request, Response, NextFunction } from 'express'
import { UsersService } from './users.service.js'
import { createUserSchema, updateUserSchema } from './users.schema.js'
import { successResponse } from '../../shared/infra/http/api-response.js'

export class UsersController {
    constructor(private readonly service: UsersService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = createUserSchema.parse(req.body)
            const user = await this.service.createUser(data)
            res.status(201).json(successResponse(user))
        } catch (error) {
            next(error)
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.service.getAllUsers()
            res.status(200).json(successResponse(users))
        } catch (error) {
            next(error)
        }
    }

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const user = await this.service.getUserById(id)
            res.status(200).json(successResponse(user))
        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const data = updateUserSchema.parse(req.body)
            const user = await this.service.updateUser(id, data)
            res.status(200).json(successResponse(user))
        } catch (error) {
            next(error)
        }
    }

    remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            await this.service.deleteUser(id)
            res.status(200).json(successResponse(null))
        } catch (error) {
            next(error)
        }
    }
}
