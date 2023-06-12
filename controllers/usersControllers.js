import mongoose from 'mongoose';
import User from '../models/userModel.js';

function errorHandler(error, res) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).send({
      message: `${Object.values(error.errors)
        .map((err) => err.message)
        .join(', ')}`,
    });
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(404).send({
      message: 'Запрашиваемая карточка не найдена',
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).send({
      message: 'Некорректный id',
    });
  }

  return res.status(500).send({ message: 'Server Error' });
}

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    res.status(200).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const addNewUser = async (req, res) => {
  try {
    const newUser = req.body;
    const user = await User.create(newUser);
    res.status(201).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const update = async (req, res, varibles) => {
  try {
    const newData = {};
    varibles.forEach((item) => (newData[item] = req.body[item]));
    const updatedUser = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }).orFail();
    res.status(200).send(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateUser = async (req, res) => {
  await update(req, res, ['name', 'about']);
};

export const updateUsersAvatar = async (req, res) => {
  await update(req, res, ['avatar']);
};
