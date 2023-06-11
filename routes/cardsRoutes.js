import { Router } from 'express';
import {
  addNewCard,
  deleteCardById,
  getAllCards,
  likeCard,
  dislikeCard,
} from '../controllers/cardsControllers.js';

const router = Router();

router.get('/', getAllCards);

router.post('/', addNewCard);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

export default router;
