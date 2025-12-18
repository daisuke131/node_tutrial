import { User } from '@prisma/client'
import { UsersRepository } from './users.repository.js'
import { CreateUserDto, UpdateUserDto } from './users.schema.js'
import { NotFoundError } from '../../shared/errors/app-error.js'

export class UsersService {
    constructor(private readonly repository: UsersRepository) { }

    async createUser(data: CreateUserDto): Promise<User> {
        // Business Logic: Check for duplicate email might go here if not handled at DB level
        // For now, we rely on DB unique constraint managed by global error handler
        return this.repository.create(data)
    }

    async getAllUsers(): Promise<User[]> {
        return this.repository.findAll()
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.repository.findById(id)
        if (!user) {
            throw new NotFoundError(`User with ID ${id} not found`)
        }
        return user
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
        // Ensure user exists first
        await this.getUserById(id)
        return this.repository.update(id, data)
    }
}
