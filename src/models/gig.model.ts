import mongoose, { Document, Schema } from 'mongoose'

export interface IGig extends Document {
  userId: string
  title: string
  desc: string
  totalStars: number
  starNumber: number
  price: number
  gigPhoto: string
  gigPhotos: string[]
  gigCloudinaryId: string
  gigCloudinaryIds: string[]
  shortDesc: string
  deliveryTime: number
  features: string[]
  sales: number
}

const GigSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    totalStars: {
      type: Number,
      default: 0
    },
    starNumber: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true
    },
    gigPhoto: {
      type: String,
      required: true
    },
    gigPhotos: {
      type: [String],
      required: true
    },
    gigCloudinaryId: {
      type: String,
      required: true
    },
    gigCloudinaryIds: {
      type: [String],
      required: true
    },
    shortDesc: {
      type: String,
      required: true
    },
    deliveryTime: {
      type: Number,
      required: true
    },
    features: {
      type: [String],
      required: true
    },
    sales: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IGig>('Gig', GigSchema)