import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  conversationId: string
  userId: string
  desc: string
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
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

export default mongoose.model<IMessage>('Message', MessageSchema)