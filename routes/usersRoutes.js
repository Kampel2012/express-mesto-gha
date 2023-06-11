import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  addNewUser,
  updateUser,
  updateUsersAvatar,
} from '../controllers/usersControllers.js';

const router = Router();

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/', addNewUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUsersAvatar);

export default router;
