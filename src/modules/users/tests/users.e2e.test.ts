import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app.js'
import { prisma } from '../../../shared/infra/db.js'

describe('User API (E2E)', () => {
    // Clean up DB before each test
    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    describe('POST /users', () => {
        it('should create a user with valid data', async () => {
            const userData = { email: 'new@example.com', name: 'New User' }

            const response = await request(app)
                .post('/users')
                .send(userData)

            expect(response.status).toBe(201)
            expect(response.body.success).toBe(true)
            expect(response.body.data).toEqual(expect.objectContaining(userData))
            expect(response.body.data).toHaveProperty('id')
        })

        it('should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/users')
                .send({ email: 'invalid-email', name: 'Test' })

            expect(response.status).toBe(400)
            expect(response.body.success).toBe(false)
            expect(response.body.error.code).toBe('VALIDATION_ERROR')
        })

        it('should return 409 for duplicate email', async () => {
            const email = 'duplicate@example.com'
            await prisma.user.create({ data: { email, name: 'Existing' } })

            const response = await request(app)
                .post('/users')
                .send({ email, name: 'New' })

            expect(response.status).toBe(409)
            expect(response.body.success).toBe(false)
            expect(response.body.error.code).toBe('CONFLICT_ERROR')
        })
    })

    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const count = 3
            for (let i = 1; i <= count; i++) {
                await prisma.user.create({
                    data: { email: `test${i}@example.com`, name: `Test User ${i}` }
                })
            }

            const response = await request(app).get('/users')

            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
            expect(response.body.data).toHaveLength(count)
        })
    })

    describe('GET /users/:id', () => {
        it('should return a user if exists', async () => {
            const user = await prisma.user.create({
                data: { email: 'findme@example.com', name: 'Find Me' }
            })

            const response = await request(app).get(`/users/${user.id}`)

            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
            expect(response.body.data.id).toBe(user.id)
        })

        it('should return 404 if not found', async () => {
            const response = await request(app).get('/users/99999')

            expect(response.status).toBe(404)
            expect(response.body.success).toBe(false)
            expect(response.body.error.code).toBe('NOT_FOUND')
        })
    })

    describe('PATCH /users/:id', () => {
        it('should update user if exists', async () => {
            const user = await prisma.user.create({
                data: { email: 'old@example.com', name: 'Old Name' }
            })

            const response = await request(app)
                .patch(`/users/${user.id}`)
                .send({ name: 'New Name' })

            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
            expect(response.body.data.name).toBe('New Name')
        })
    })

    describe('DELETE /users/:id', () => {
        it('should delete user if exists', async () => {
            const user = await prisma.user.create({
                data: { email: 'delete@example.com', name: 'Delete Me' }
            })

            const response = await request(app).delete(`/users/${user.id}`)

            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)

            // Confirm deleted from DB
            const check = await prisma.user.findUnique({ where: { id: user.id } })
            expect(check).toBeNull()
        })

        it('should return 404 if user to delete does not exist', async () => {
            const response = await request(app).delete('/users/99999')

            expect(response.status).toBe(404)
            expect(response.body.success).toBe(false)
            expect(response.body.error.code).toBe('NOT_FOUND')
        })
    })
})
