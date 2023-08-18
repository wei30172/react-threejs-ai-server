import express, { Router } from 'express'
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware'
import {
  generateDalleImage
} from '../controllers/dalle.controlles'

const router: Router = express.Router()

router.post('/', verifyToken, verifyAdmin, generateDalleImage)

export default router