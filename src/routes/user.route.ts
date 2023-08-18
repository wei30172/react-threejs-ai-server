import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import { getUserInfoById, deleteUser, getUserProfile, updateUserProfile, isAdminUser } from '../controllers/user.controller'

const router: Router = express.Router()

router.route('/profile')
  .get(verifyToken, getUserProfile)
  .delete(verifyToken, deleteUser)
  .put(verifyToken, updateUserProfile)
router.get('/isAdmin', verifyToken, isAdminUser)
router.get('/:id', getUserInfoById)

export default router