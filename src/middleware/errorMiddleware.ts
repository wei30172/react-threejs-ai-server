import { Request, Response, NextFunction } from 'express'
import HttpStatusCode from '../constants/httpStatusCodes'

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(HttpStatusCode.NOT_FOUND)
  next(error)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === HttpStatusCode.OK ? HttpStatusCode.INTERNAL_SERVER_ERROR : res.statusCode
  const message = err.message

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

export { notFound, errorHandler }