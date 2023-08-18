import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  address: string
  phone: string
  isAdmin: boolean
  userPhoto?: string
  userCloudinaryId?: string
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  userPhoto: {
    type: String,
    required: false
  },
  userCloudinaryId: {
    type: String,
    required: false
  }
},{
  timestamps: true
})

export default mongoose.model<IUser>('User', userSchema)