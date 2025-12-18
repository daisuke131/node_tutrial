export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly code: string

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'APP_ERROR',
        isOperational: boolean = true
    ) {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor)
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND')
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict') {
        super(message, 409, 'CONFLICT_ERROR')
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400, 'BAD_REQUEST')
    }
}
