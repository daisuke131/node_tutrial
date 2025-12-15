// アプリの定義
import express from 'express'
import healthRouter from './routes/health.js'
import echoRouter from './routes/echo.js'
import { errorHandler } from './middlewares/error.js'

export const app = express()

// ①body を読む
app.use(express.json())

// ②ルーティング
app.use('/health', healthRouter)
app.use('/echo', echoRouter)

// ③エラー
// 順序を間違えると：
// req.body が undefined
// エラーが握りつぶされる
app.use(errorHandler)