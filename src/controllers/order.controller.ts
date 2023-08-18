import { NextFunction, Response } from 'express'
import Stripe from 'stripe'
import { deleteFromFolder } from '../utils/cloudinaryUploader'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import Order from '../models/order.model'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/authMiddleware'

const requiredParams = ['name', 'email', 'address', 'phone', 'color', 'designPhoto', 'designCloudinaryId']

// @desc    Create Order
// @route   POST /api/orders
// @access  Private
export const createOrder =  async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const {
    logoDecalCloudinaryId,
    fullDecalCloudinaryId,
    designCloudinaryId
  } = req.body

  try {
    const gig = await Gig.findById(req.body.gigId)

    if (!gig) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Gig not found'))
    }

    for (const param of requiredParams) {
      if (!req.body[param]) {
        return next(createError(HttpStatusCode.BAD_REQUEST, `Missing parameter: ${param}`))
      }
    }

    const newOrder = new Order({
      gigPhoto: gig.gigPhoto,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      isPaid: false,
      paymentIntent: '',
      ...req.body
    })

    await newOrder.save()

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { sales: 1 }
    }, { new: true })

    res.status(HttpStatusCode.OK).json(newOrder)
  } catch (err) {
    // Delete the image from Cloudinary
    if (logoDecalCloudinaryId) {
      await deleteFromFolder(logoDecalCloudinaryId)
    }
    if (fullDecalCloudinaryId) {
      await deleteFromFolder(fullDecalCloudinaryId)
    }
    if (designCloudinaryId) {
      await deleteFromFolder(designCloudinaryId)
    }
    next(err)
  }
}

const getStripe = () => {
  const stripeKey = process.env.STRIPE_KEY
  if (!stripeKey) {
    throw createError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Stripe key not set')
  }

  return new Stripe(stripeKey, { apiVersion: '2022-11-15' })
}

export default getStripe

// @desc    Create Payment Intent
// @route   POST /api/orders/create-payment-intent/:id
// @access  Private
export const intent = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Order not found'))
    }

    const stripe = getStripe()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'USD', // todo
      metadata: { orderId: order._id.toString() }
    })

    if (!paymentIntent) {
      return next(createError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Failed to create payment intent'))
    }

    order.paymentIntent = paymentIntent.id

    await order.save()

    res.status(HttpStatusCode.OK).send({
      clientSecret: paymentIntent.client_secret
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get Orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({
      ...(req.isAdmin ? { sellerId: req.userId } : { buyerId: req.userId })
    })

    res.status(HttpStatusCode.OK).send(orders)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single Order
// @route   GET /api/orders/single/:id
// @access  Private
export const getSingleOrder = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Order not found!'))
    }
    res.status(HttpStatusCode.OK).send(order)
  } catch (err) {
    next(err)
  }
}

// @desc    Confirm Payment
// @route   PUT /api/orders
// @access  Private
export const confirm = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stripe = getStripe()

    const paymentIntent = await stripe.paymentIntents.retrieve(req.body.paymentIntent)
    const orderId = paymentIntent.metadata.orderId // Get the order id from PaymentIntent metadata

    const order = await Order.findById(orderId)

    if (!order) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Order not found.'))
    }

    order.isPaid = true
    await order.save()

    res.status(HttpStatusCode.OK).send({ message: 'Order has been confirmed.'})
  } catch (err) {
    next(err)
  }
}