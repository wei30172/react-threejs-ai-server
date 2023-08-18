import mongoose, { Schema, Document } from 'mongoose'

interface IPost extends Document {
  name: string
  prompt: string
  postPhoto: string
  postCloudinaryId: string
}

const PostSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    postPhoto: {
      type: String,
      required: true
    },
    postCloudinaryId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IPost>('Post', PostSchema)