import Card from '../models/cardModel.js';

function errorHandler(error, res) {
  if (error.name === 'ValidationError') {
    return res.status(400).send({
      message: `${Object.values(error.errors)
        .map((err) => err.message)
        .join(', ')}`,
    });
  }

  if (error.name === 'CastError') {
    return res.status(404).send({
      message: 'Запрашиваемая карточка не найдена',
    });
  }

  return res.status(500).send({ message: 'Server Error' });
}

export const getAllCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const addNewCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.status(201).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteCardById = async (req, res) => {
  try {
    if (req.params.cardId.length <= 20) {
      res.status(400).send({ message: 'Некорректный id' });
      return;
    }
    const cardForChange = await Card.findById(req.params.cardId);
    if (cardForChange == null) {
      res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      return;
    }
    await Card.findByIdAndDelete(req.params.cardId);
    res.status(200).send({ message: 'Успешно удалено!' });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const likeCard = async (req, res) => {
  console.log('here');
  try {
    if (req.params.cardId.length <= 20) {
      res.status(400).send({ message: 'Некорректный id' });
      return;
    }
    const cardForChange = await Card.findById(req.params.cardId);
    if (cardForChange == null) {
      res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      return;
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    res.status(201).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const dislikeCard = async (req, res) => {
  try {
    if (req.params.cardId.length <= 20) {
      res.status(400).send({ message: 'Некорректный id' });
      return;
    }
    const cardForChange = await Card.findById(req.params.cardId);
    if (cardForChange == null) {
      res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      return;
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    res.status(200).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};
