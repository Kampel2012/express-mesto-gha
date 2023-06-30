import { constants as http2Constants } from 'node:http2';
import mongoose from 'mongoose';
import validator from 'validator';
import Card from '../models/cardModel.js';
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from '../errors/errors.js';

function errorHandler(error, res, next) {
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError('Неправильно заполнены поля'));
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    next(new NotFoundError('Запрашиваемая карточка не найдена'));
  }

  if (error instanceof mongoose.Error.CastError) {
    next(new BadRequestError('Некорректный id'));
  }

  next(error);
}

export const getAllCards = async (req, res, next) => {
  try {
    const allCards = await Card.find({});
    res.status(http2Constants.HTTP_STATUS_OK).send(allCards);
  } catch (error) {
    errorHandler(error, res, next);
  }
};

export const addNewCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user;
    if (!link || !validator.isURL(link)) {
      throw new mongoose.Error.ValidationError();
    }
    const card = await Card.create({ name, link, owner: _id });
    res.status(http2Constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    errorHandler(error, res, next);
  }
};

export const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail();
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав для данного действия');
    }
    await Card.deleteOne(card).orFail();
    res
      .status(http2Constants.HTTP_STATUS_OK)
      .send({ message: 'Успешно удалено!' });
  } catch (error) {
    errorHandler(error, res, next);
  }
};

export const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail();

    res.status(http2Constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    errorHandler(error, res, next);
  }
};

export const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(card);
  } catch (error) {
    errorHandler(error, res, next);
  }
};
