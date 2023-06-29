import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { login, addNewUser } from '../controllers/usersControllers.js';
import auth from '../middlewares/auth.js';
import userRouter from './usersRoutes.js';
import cardRouter from './cardsRoutes.js';
import validationRegex from '../utils/constants.js';

const router = Router();

router.use(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.use(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(20),
      avatar: Joi.string().regex(validationRegex),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  addNewUser,
);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

export default router;
