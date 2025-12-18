import { PrismaClient, User } from '@prisma/client'
import { CreateUserDto, UpdateUserDto } from './users.schema.js'

export class UsersRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateUserDto): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
            },
        })
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        })
    }

    async delete(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        })
    }
}
