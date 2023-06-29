import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUsersAvatar,
  getUserInfo,
} from '../controllers/usersControllers.js';

import validationRegex from '../utils/constants.js';

const router = Router();

router.get('/', getAllUsers);

router.get(
  '/me',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  getUserInfo,
);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(validationRegex),
    }),
  }),
  updateUsersAvatar,
);

export default router;
