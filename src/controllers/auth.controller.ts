import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { deleteFromFolder } from '../utils/cloudinaryUploader'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import User from '../models/user.model'

const SALT_ROUNDS = 10

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, userCloudinaryId } = req.body

  try {
    if (!email || !password) {
      return next(createError(HttpStatusCode.BAD_REQUEST, 'Missing email or password'))
    }

    const user = await User.findOne({ email })
    if (user) return next(createError(HttpStatusCode.CONFLICT, 'The email has been registered'))

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    const newUser = new User({
      ...req.body,
      isAdmin: false,
      password: hash
    })

    await newUser.save()
    res.status(HttpStatusCode.CREATED).json({ message: 'User has been created please login.' })
  } catch (err) {
    // Delete the image from Cloudinary
    if (userCloudinaryId) {
      await deleteFromFolder(userCloudinaryId)
    }
    next(err)
  }
}

// @desc    login & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password: userInputPassword } = req.body
    
    if (!email || !userInputPassword) {
      return next(createError(HttpStatusCode.BAD_REQUEST, 'Missing email or password'))
    }

    const user = await User.findOne({ email })
    if (!user) return next(createError(HttpStatusCode.NOT_FOUND, 'Wrong email or password'))

    const isCorrect = await bcrypt.compare(userInputPassword, user.password)
    if (!isCorrect) return next(createError(HttpStatusCode.NOT_FOUND, 'Wrong email or password'))

    const jwtKey = process.env.JWT_KEY
    if (!jwtKey) {
      return next(createError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'INTERNAL SERVER ERROR'))
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin
      },
      jwtKey,
      {
        expiresIn: '30d'
      }
    )

    const userObject = user.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = userObject
    
    res
      .cookie('accessToken', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax' // Use 'none' in production, 'lax' in development
      })
      .status(HttpStatusCode.OK)
      .json(info)
  } catch (err) {
    next(err)
  }
}

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res
    .clearCookie('accessToken', {
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax' // Use 'none' in production, 'lax' in development
    })
    .status(HttpStatusCode.OK)
    .json({ message: 'User has been logged out'})
}