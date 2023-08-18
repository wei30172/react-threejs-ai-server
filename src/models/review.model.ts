import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  gigId: string
  userId: string
  star: 1 | 2 | 3 | 4 | 5
  desc: string
}

const ReviewSchema: Schema = new Schema(
  {
    gigId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    star: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5]
    },
    desc: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IReview>('Review', ReviewSchema)