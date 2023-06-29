import { Router } from 'express';
import { login, addNewUser } from '../controllers/usersControllers.js';
import auth from '../middlewares/auth.js';
import userRouter from './usersRoutes.js';
import cardRouter from './cardsRoutes.js';

const router = Router();

router.use('/signin', login);
router.use('/signup', addNewUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

export default router;
