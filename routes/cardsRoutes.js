import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  addNewCard,
  deleteCardById,
  getAllCards,
  likeCard,
  dislikeCard,
} from '../controllers/cardsControllers.js';
import validationRegex from '../utils/constants.js';

const router = Router();

router.get('/', getAllCards);

router.post(
  '/',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex(),
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().regex(validationRegex),
    }),
  }),
  addNewCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCardById,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  dislikeCard,
);

export default router;
