import mongoose, { Document, Schema } from 'mongoose'

export interface IConversation extends Document {
  id: string
  sellerId: string
  buyerId: string
  readBySeller: boolean
  readByBuyer: boolean
  lastMessage?: string
}

const ConversationSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: mongoose.Types.ObjectId
    },
    sellerId: {
      type: String,
      required: true
    },
    buyerId: {
      type: String,
      required: true
    },
    readBySeller: {
      type: Boolean,
      required: true
    },
    readByBuyer: {
      type: Boolean,
      required: true
    },
    lastMessage: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IConversation>('Conversation', ConversationSchema)