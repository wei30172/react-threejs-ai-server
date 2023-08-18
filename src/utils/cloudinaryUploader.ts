import { v2 as cloudinary } from 'cloudinary'
import createError from './createError'
import HttpStatusCode from '../constants/httpStatusCodes'

export const uploadToFolder = async (photo: string, folderName = 'shop') => {
  try {
    return await cloudinary.uploader.upload(photo, {
      folder: folderName
    })
  } catch (err) {
    throw createError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Failed to upload to Cloudinary')
  }
}

export const deleteFromFolder = async (cloudinary_id: string) => {
  try {
    return await cloudinary.uploader.destroy(cloudinary_id)
  } catch (err) {
    throw createError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Failed to delete from Cloudinary')
  }
}