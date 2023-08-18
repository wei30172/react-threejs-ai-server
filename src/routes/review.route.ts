import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import {
  createReview,
  getReviewsByGig,
  deleteReview
} from '../controllers/review.controller'


const router: Router = express.Router()

router.post('/', verifyToken, createReview )
router.get('/:gigId', getReviewsByGig )
router.delete('/:id', verifyToken, deleteReview)

export default router