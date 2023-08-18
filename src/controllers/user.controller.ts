import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { deleteFromFolder } from '../utils/cloudinaryUploader'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import User, { IUser } from '../models/user.model'
import { IRequest } from '../middleware/authMiddleware'

const SALT_ROUNDS = 10

// @desc    Update User Profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { username, password: userInputPassword, userPhoto, userCloudinaryId } = req.body
  
  try {
    const user = await User.findById(req.userId) as IUser

    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    if (userPhoto && userCloudinaryId) {
      // Delete the image from Cloudinary
      if (user.userCloudinaryId) {
        await deleteFromFolder(user.userCloudinaryId)
      }

      user.userPhoto = userPhoto
      user.userCloudinaryId = userCloudinaryId
    }

    if (username) {
      user.username = username
    }
      
    if (userInputPassword) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS)
      user.password = await bcrypt.hash(userInputPassword, salt)
    }

    const updatedUser = await user.save()

    const userObject = updatedUser.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = userObject

    res.status(HttpStatusCode.OK).json(info)

  } catch (err) {
    // Delete the image from Cloudinary
    if (userCloudinaryId) {
      await deleteFromFolder(userCloudinaryId)
    }
    next(err)
  }
}

// @desc    Delete Single User
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    // Delete the image from Cloudinary
    if (user.userCloudinaryId) {
      await deleteFromFolder(user.userCloudinaryId)
    }

    await User.findByIdAndDelete(req.userId)

    res.status(HttpStatusCode.OK).json({ message: 'User deleted successfully' })
  } catch (err: unknown) {
    next(err as Error)
  }
}

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser
  
    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    res.status(HttpStatusCode.OK).json({
      userPhoto: user.userPhoto,
      username: user.username
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Check if User is Admin
// @route   GET /api/users/isAdmin
// @access  Private
export const isAdminUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser
  
    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    res.status(HttpStatusCode.OK).json({ isAdmin: user.isAdmin })
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single User
// @route   GET /api/users/:id
// @access  Public
export const getUserInfoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id

    if (!userId) {
      return next(createError(HttpStatusCode.BAD_REQUEST, 'User ID is required'))
    }

    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }
    
    res.status(HttpStatusCode.OK).json({
      userPhoto: user.userPhoto,
      username: user.username
    })
  } catch (err) {
    next(err)
  }
}