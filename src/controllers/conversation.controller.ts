import { NextFunction, Response } from 'express'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import Conversation from '../models/conversation.model'
import { IRequest } from '../middleware/authMiddleware'

// @desc    Create Conversation
// @route   POST /api/conversations
// @access  Private
export const createConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { userId, isAdmin, body: { to } } = req
  
  if (!userId || !to) return next(createError(HttpStatusCode.BAD_REQUEST, 'Invalid parameters'))

  const newConversation = new Conversation({
    id: isAdmin ? userId + to : to + userId, // sellerId + buyerId
    sellerId: isAdmin ? userId : to,
    buyerId: isAdmin ? to : userId,
    readBySeller: isAdmin,
    readByBuyer: !isAdmin
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(HttpStatusCode.CREATED).send(savedConversation)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single Conversation
// @route   GET /api/conversations/single/:id
// @access  Private

export const getSingleConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { params: { id } } = req

  if (!id) return next(createError(HttpStatusCode.BAD_REQUEST, 'Invalid parameters'))

  try {
    const conversation = await Conversation.findOne({ id })
    if (!conversation) return next(createError(HttpStatusCode.NOT_FOUND, 'Conversation not found'))
    res.status(HttpStatusCode.OK).send(conversation)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Conversations
// @route   GET /api/conversations
// @access  Private
export const getConversations = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { userId, isAdmin } = req

  try {
    const conversations = await Conversation.find(
      isAdmin ? { sellerId: userId } : { buyerId: userId }
    ).sort({ updatedAt: -1 })
    res.status(HttpStatusCode.OK).send(conversations)
  } catch (err) {
    next(err)
  }
}

// @desc    Update Conversation
// @route   PUT /api/conversations/:id
// @access  Private
export const updateConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { params: { id }, isAdmin } = req

  if (!id) return next(createError(HttpStatusCode.BAD_REQUEST, 'Invalid parameters'))

  try {
    const conversation = await Conversation.findOne({ id })

    if (!conversation) return next(createError(HttpStatusCode.NOT_FOUND, 'Conversation not found'))

    const updatedConversation = await Conversation.findOneAndUpdate(
      { id },
      {
        $set: {
          ...(isAdmin 
            ? { readBySeller: !conversation?.readBySeller } 
            : { readByBuyer: !conversation?.readByBuyer })
        }
      },
      { new: true }
    )

    res.status(HttpStatusCode.OK).send(updatedConversation)
  } catch (err) {
    next(err)
  }
}