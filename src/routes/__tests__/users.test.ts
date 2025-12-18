import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

describe('User API', () => {
    // 各テストの前にデータベースをクリーンアップする
    beforeEach(async () => {
        await prisma.user.deleteMany()
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
    })
})
