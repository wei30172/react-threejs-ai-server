import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import { getSingleOrder, getOrders, createOrder, intent, confirm } from '../controllers/order.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createOrder)
router.post('/create-payment-intent/:id', verifyToken, intent)
router.get('/', verifyToken, getOrders)
router.get('/single/:id', verifyToken, getSingleOrder)
router.put('/confirm', verifyToken, confirm)

export default router