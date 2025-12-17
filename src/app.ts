import express from 'express'
import { errorHandler } from './middlewares/error.js'
import usersRouter from './routes/users.js'

export const app = express()

// JSONボディパーサー
app.use(express.json())

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// ルーティング
app.use('/users', usersRouter)

// エラーハンドリング（最後に配置）
app.use(errorHandler)
