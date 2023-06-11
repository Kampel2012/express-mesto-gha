import { Router } from 'express';
import userRouter from './usersRoutes.js';
import cardRouter from './cardsRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;
