import { NextFunction, Request, Response } from 'express'
import { Configuration, OpenAIApi } from 'openai'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import * as dotenv from 'dotenv'

dotenv.config()

// Create a new instance of OpenAI API
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

// @desc    Create AI Image
// @route   POST /api/dalle
// @access  private
export const generateDalleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return next(createError(HttpStatusCode.BAD_REQUEST, 'Invalid prompt'))
    }

    // Use OpenAI API to create an image based on the 'prompt'
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    })

    // Get the base64-encoded image from the response
    const image = response.data.data[0].b64_json

    res.status(HttpStatusCode.OK).json(image)
  } catch (err) {
    console.error(err)
    next(err)
  }
}