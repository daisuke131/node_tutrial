import { z } from 'zod'

export const createUserSchema = z.object({
    email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
    name: z.string().min(1, '名前は1文字以上必要です').optional(),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>
