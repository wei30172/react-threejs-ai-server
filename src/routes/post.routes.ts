import express, { Router } from 'express'
import * as dotenv from 'dotenv'

import { verifyToken, verifyAdmin } from '../middleware/authMiddleware'
import { getImagePosts, createImagePost, deleteImagePost } from '../controllers/post.controlles'

dotenv.config()

const router: Router = express.Router()

router.get('/', verifyToken, getImagePosts)
router.post('/', verifyToken, verifyAdmin, createImagePost)
router.delete('/:id', verifyToken, verifyAdmin, deleteImagePost)

export default router