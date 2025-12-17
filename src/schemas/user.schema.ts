import { z } from 'zod'

// ユーザー作成時のバリデーション
export const createUserSchema = z.object({
  email: z.email({ message: '有効なメールアドレスを入力してください' }),
  name: z.string().min(1, '名前は1文字以上必要です').optional(),
})
