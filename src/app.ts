import express from 'express'
import { errorHandler } from './middlewares/error.js'

export const app = express()

// JSONボディパーサー
app.use(express.json())

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// ルーティングはここに追加していきます
// app.use('/users', usersRouter)
// app.use('/posts', postsRouter)
// app.use('/favorites', favoritesRouter)

// エラーハンドリング（最後に配置）
app.use(errorHandler)
