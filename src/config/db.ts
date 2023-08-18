import mongoose from 'mongoose'

const connectDB = async (url: string): Promise<void> => {
  try {
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(url)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Failed to connect with MongoDB')
    console.error(error)
  }
}

export default connectDB