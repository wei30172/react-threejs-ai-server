import { Request, Response, NextFunction } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import User from '../models/user.model'

export interface IRequest extends Request {
  userId?: string
  isAdmin?: boolean
}

interface IPayload {
  id: string
  isAdmin: boolean
}

export const verifyToken = (req: IRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies['accessToken']

  if (!token) return next(createError(HttpStatusCode.UNAUTHORIZED, 'You are not authenticated!' ))
  
  const jwtKey = process.env.JWT_KEY

  if (!jwtKey) {
    return next(createError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'INTERNAL SERVER ERROR' )) 
  }

  jwt.verify(token, jwtKey, (err: JsonWebTokenError | null, payload: unknown) => {
    if (err) return next(createError(HttpStatusCode.FORBIDDEN, 'Token is not valid!' ))
    
    const typedPayload = payload as IPayload

    req.userId = typedPayload.id
    req.isAdmin = typedPayload.isAdmin
    next()
  })
}

export const verifyAdmin = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    if (!user.isAdmin) {
      return next(createError(HttpStatusCode.FORBIDDEN, 'You are not authenticated!'))
    }

    next()
  } catch (err) {
    return next(err)
  }
}