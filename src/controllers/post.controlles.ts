import { NextFunction, Request, Response } from 'express'
import { UploadApiResponse } from 'cloudinary'
import { uploadToFolder, deleteFromFolder } from '../utils/cloudinaryUploader'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import Post from '../models/post.model'

// @desc    Get AI Images
// @route   GET /api/imageposts
// @access  Public
export const getImagePosts = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query

  const filters = {
    ...(search && { prompt: { $regex: search, $options: 'i' } })
  }
  
  try {
    const images = await Post.find(filters)
    res.status(HttpStatusCode.OK).json(images)
  } catch (err) {
    next(err)
  }
}

// @desc    Create Single AI Image
// @route   POST /api/imageposts
// @access  Public
export const createImagePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, prompt, photo } = req.body

    if (!name || !prompt || !photo) {
      return next(createError(HttpStatusCode.BAD_REQUEST, 'Name, prompt, and photo are required' ))
    }

    const photoData: UploadApiResponse = await uploadToFolder(photo)

    const newImage = await Post.create({
      name,
      prompt,
      postPhoto: photoData.url,
      postCloudinaryId: photoData.public_id
    })

    res.status(HttpStatusCode.OK).json(newImage)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete Single AI Image
// @route   DELETE /api/imageposts/:id
// @access  Public
export const deleteImagePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Post not found' ))
    }

    // Delete the image from Cloudinary
    if (post.postCloudinaryId) {
      await deleteFromFolder(post.postCloudinaryId)
    }

    await Post.findByIdAndDelete(req.params.id)
    
    res.status(HttpStatusCode.OK).json({ message: 'Post deleted successfully' })
  } catch (err) {
    next(err)
  }
}