import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

describe('User API', () => {
    // 各テストの前にデータベースをクリーンアップする
    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    describe('POST /users', () => {
        it('正常なデータでユーザーを作成できること', async () => {
            const userData = { email: 'new@example.com', name: 'New User' }

            const response = await request(app)
                .post('/users')
                .send(userData)

            expect(response.status).toBe(201)
            expect(response.body).toEqual(expect.objectContaining(userData))
            expect(response.body).toHaveProperty('id')
        })

        it('不正な形式のメールアドレスの場合、400エラーを返すこと', async () => {
            const response = await request(app)
                .post('/users')
                .send({ email: 'invalid-email', name: 'Test' })

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Validation Error')
        })

        it('名前が空文字の場合、400エラーを返すこと', async () => {
            const response = await request(app)
                .post('/users')
                .send({ email: 'valid@example.com', name: '' })

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Validation Error')
        })

        it('既に存在するメールアドレスの場合、409エラーを返すこと', async () => {
            const email = 'duplicate@example.com'
            // 先に1人作成
            await prisma.user.create({ data: { email, name: 'Existing' } })

            const response = await request(app)
                .post('/users')
                .send({ email, name: 'New' })

            expect(response.status).toBe(409)
            expect(response.body.error).toBe('Unique constraint violation')
        })
    })

    describe('GET /users', () => {
        it('ユーザー一覧を正常に取得できること', async () => {
            // 3人分のテストデータをループで作る
            const count = 3
            for (let i = 1; i <= count; i++) {
                await prisma.user.create({
                    data: { email: `test${i}@example.com`, name: `Test User ${i}` }
                })
            }

            const response = await request(app).get('/users')

            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(count)

            // indexに基づいたデータが含まれているか検証
            for (let i = 1; i <= count; i++) {
                expect(response.body).toContainEqual(
                    expect.objectContaining({
                        email: `test${i}@example.com`,
                        name: `Test User ${i}`
                    })
                )
            }
        })

        it('ユーザーが一人もいない場合は空配列を返すこと', async () => {
            const response = await request(app).get('/users')

            expect(response.status).toBe(200)
            expect(response.body).toEqual([])
        })
    })

    describe('GET /users/:id', () => {
        it('存在するIDを指定した場合、ユーザー情報を取得できること', async () => {
            // テストデータを1件作成
            const user = await prisma.user.create({
                data: { email: 'findme@example.com', name: 'Find Me' }
            })

            const response = await request(app).get(`/users/${user.id}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual(expect.objectContaining({
                id: user.id,
                email: user.email,
                name: user.name
            }))
        })

        it('存在しないIDを指定した場合、404エラーを返すこと', async () => {
            const response = await request(app).get('/users/999')

            expect(response.status).toBe(404)
            expect(response.body).toEqual({ error: 'User not found' })
        })
    })

    describe('PATCH /users/:id', () => {
        it('ユーザー情報を部分的に更新できること', async () => {
            // テストデータを1件作成
            const user = await prisma.user.create({
                data: { email: 'old@example.com', name: 'Old Name' }
            })

            const response = await request(app)
                .patch(`/users/${user.id}`)
                .send({ name: 'New Name' })

            expect(response.status).toBe(200)
            expect(response.body).toEqual(expect.objectContaining({
                id: user.id,
                email: 'old@example.com',
                name: 'New Name'
            }))
        })

        it('存在しないIDを指定した場合、404エラーを返すこと', async () => {
            const response = await request(app)
                .patch('/users/999')
                .send({ name: 'New Name' })

            expect(response.status).toBe(404)
        })

        it('不正な形式のメールアドレスの場合、400エラーを返すこと', async () => {
            // テストデータを1件作成
            const user = await prisma.user.create({
                data: { email: 'valid@example.com', name: 'Test User' }
            })

            const response = await request(app)
                .patch(`/users/${user.id}`)
                .send({ email: 'invalid-email' })

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Validation Error')
        })

        it('名前が空文字の場合、400エラーを返すこと', async () => {
            // テストデータを1件作成
            const user = await prisma.user.create({
                data: { email: 'valid@example.com', name: 'Test User' }
            })

            const response = await request(app)
                .patch(`/users/${user.id}`)
                .send({ name: '' })

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Validation Error')
        })

        it('既に存在するメールアドレスの場合、409エラーを返すこと', async () => {
            // テストデータを2件作成
            const user1 = await prisma.user.create({
                data: { email: 'user1@example.com', name: 'User 1' }
            })
            await prisma.user.create({
                data: { email: 'user2@example.com', name: 'User 2' }
            })

            // user1のメールをuser2のものに変更しようとする
            const response = await request(app)
                .patch(`/users/${user1.id}`)
                .send({ email: 'user2@example.com' })

            expect(response.status).toBe(409)
            expect(response.body.error).toBe('Unique constraint violation')
        })
    })
})
