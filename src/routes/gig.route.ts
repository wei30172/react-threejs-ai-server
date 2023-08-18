import express, { Router } from 'express'
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware'
import {
  createGig,
  getGigs,
  getSingleGig,
  deleteGig,
  updateGig
} from '../controllers/gig.controller'

const router: Router = express.Router()

router.post('/', verifyToken, verifyAdmin, createGig)
router.get('/', getGigs)
router.get('/single/:id', getSingleGig)
router.delete('/:id', verifyToken, verifyAdmin, deleteGig)
router.put('/:id', verifyToken, verifyAdmin, updateGig)

export default router