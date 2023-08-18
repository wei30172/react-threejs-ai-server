import express, { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import connectDB from './config/db'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddleware'

// Routes
import userRoute from './routes/user.route'
import gigRoute from './routes/gig.route'
import orderRoute from './routes/order.route'
import conversationRoute from './routes/conversation.route'
import messageRoute from './routes/message.route'
import reviewRoute from './routes/review.route'
import authRoute from './routes/auth.route'
import postRoutes from './routes/post.routes'
import dalleRoutes from './routes/dalle.routes'

dotenv.config()

// Create a new instance of Cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const port = process.env.PORT || '8080'

const startServer = async () => {
  const mongoDbUrl = process.env.MONGODB_URL

  if (!mongoDbUrl) {
    return console.error('MONGODB_URL is not defined in environment variables.')
  }

  try {
    connectDB(mongoDbUrl)
  } catch (err) {
    console.error(err)
  }
}

startServer()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://capture-magical-moment.netlify.app'],
  credentials: true
})) // todo

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/gigs', gigRoute)
app.use('/api/orders', orderRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)
app.use('/api/reviews', reviewRoute)
app.use('/api/imageposts', postRoutes)
app.use('/api/dalle', dalleRoutes)

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running....')
})

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))