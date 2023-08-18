import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import {
  createMessage,
  getMessages
} from '../controllers/message.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createMessage)
router.get('/:id', verifyToken, getMessages)

export default router