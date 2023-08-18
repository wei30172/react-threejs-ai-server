import { NextFunction, Request, Response } from 'express'
import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import HttpStatusCode from '../constants/httpStatusCodes'
import { IRequest } from '../middleware/authMiddleware'

// @desc    Create Message
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc
  })
  try {
    const savedMessage = await newMessage.save()
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isAdmin,
          readByBuyer: !req.isAdmin,
          lastMessage: req.body.desc
        }
      },
      { new: true }
    )

    res.status(HttpStatusCode.CREATED).send(savedMessage)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Messages
// @route   GET /api/messages/:id
// @access  Private
export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await Message.find({ conversationId: req.params.id })
    res.status(HttpStatusCode.OK).send(messages)
  } catch (err) {
    next(err)
  }
}