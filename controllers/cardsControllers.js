import { constants as http2Constants } from 'node:http2';
import mongoose from 'mongoose';
import validator from 'validator';
import Card from '../models/cardModel.js';

class ErrorNotEnoughRights extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorNotEnoughRights';
  }
}

function errorHandler(error, res) {
  if (error instanceof ErrorNotEnoughRights) {
    return res.status(http2Constants.HTTP_STATUS_FORBIDDEN).send({
      message: 'Недостаточно прав для данного действия',
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: 'Неправильно заполнены поля',
    });
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(http2Constants.HTTP_STATUS_NOT_FOUND).send({
      message: 'Запрашиваемая карточка не найдена',
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: 'Некорректный id',
    });
  }

  return res
    .status(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: 'Server Error' });
}

export const getAllCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    res.status(http2Constants.HTTP_STATUS_OK).send(allCards);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const addNewCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user;
    if (!link || !validator.isURL(link)) {
      throw new mongoose.Error.ValidationError();
    }
    const card = await Card.create({ name, link, owner: _id });
    res.status(http2Constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail();
    if (card.owner != req.user._id) throw new ErrorNotEnoughRights();
    await Card.findByIdAndDelete(req.params.cardId).orFail();
    res
      .status(http2Constants.HTTP_STATUS_OK)
      .send({ message: 'Успешно удалено!' });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    ).orFail();

    res.status(http2Constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    ).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};
