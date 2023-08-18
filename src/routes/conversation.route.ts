import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation
} from '../controllers/conversation.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createConversation)
router.get('/', verifyToken, getConversations)
router.get('/single/:id', verifyToken, getSingleConversation)
router.put('/:id', verifyToken, updateConversation)

export default router