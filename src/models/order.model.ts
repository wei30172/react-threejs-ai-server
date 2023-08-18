import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  gigId: string
  gigPhoto: string
  title: string
  price: number
  sellerId: string
  buyerId: string
  isPaid: boolean
  paymentIntent: string
  name: string
  email: string
  address: string
  phone: string
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecalPhoto: string
  fullDecalPhoto: string
  logoDecalCloudinaryId: string
  fullDecalCloudinaryId: string
  designPhoto: string
  designCloudinaryId: string
}

const OrderSchema: Schema = new Schema(
  {
    gigId: {
      type: String,
      required: true
    },
    gigPhoto: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    sellerId: {
      type: String,
      required: true
    },
    buyerId: {
      type: String,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentIntent: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    email: {
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
    color: {
      type: String,
      required: true
    },
    isLogoTexture: {
      type: Boolean,
      required: true
    },
    isFullTexture: {
      type: Boolean,
      required: true
    },
    logoDecalPhoto: {
      type: String,
      required: false
    },
    fullDecalPhoto: {
      type: String,
      required: false
    },
    logoDecalCloudinaryId: {
      type: String,
      required: false
    },
    fullDecalCloudinaryId: {
      type: String,
      required: false
    },
    designPhoto: {
      type: String,
      required: true
    },
    designCloudinaryId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IOrder>('Order', OrderSchema)