export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        details?: unknown
    }
}

export const successResponse = <T>(data: T): ApiResponse<T> => {
    return {
        success: true,
        data,
    }
}

export const errorResponse = (
    message: string,
    code: string = 'INTERNAL_ERROR',
    details?: unknown
): ApiResponse<null> => {
    return {
        success: false,
        error: {
            code,
            message,
            details,
        },
    }
}
