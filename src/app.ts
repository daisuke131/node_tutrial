import express from 'express'
import { errorHandler } from './shared/infra/http/middlewares/error.middleware.js'
import usersRouter from './modules/users/users.routes.js'

export const app = express()

// Middlewares
app.use(express.json())

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/users', usersRouter)

// Global Error Handler (Must be last)
app.use(errorHandler)
