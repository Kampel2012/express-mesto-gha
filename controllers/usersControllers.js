import { constants as http2Constants } from 'node:http2';
import validator from 'validator';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';

const SALT_ROUNDES = 10;

class ErrorLogin extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorLogin';
  }
}

function errorHandler(error, res) {
  if (error instanceof ErrorLogin) {
    return res.status(http2Constants.HTTP_STATUS_UNAUTHORIZED).send({
      message: 'Неверный логин или пароль',
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: 'Неправильно заполнены поля',
    });
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(http2Constants.HTTP_STATUS_NOT_FOUND).send({
      message: 'Запрашиваемый пользователь не найден',
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: 'Некорректный id',
    });
  }

  if (error.code === 11000) {
    return res.status(http2Constants.HTTP_STATUS_CONFLICT).send({
      message: 'Пользователь с таким значением уже существует.',
    });
  }

  return res
    .status(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: 'Server Error' });
}

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(http2Constants.HTTP_STATUS_OK).send(allUsers);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const update = async (req, res, varibles) => {
  try {
    const newData = {};
    varibles.forEach((item) => {
      newData[item] = req.body[item];
    });
    const updatedUser = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateUser = async (req, res) => {
  await update(req, res, ['name', 'about']);
};

export const updateUsersAvatar = async (req, res) => {
  try {
    if (!req.body.avatar || !validator.isURL(req.body.avatar)) {
      throw new mongoose.Error.ValidationError();
    }
    await update(req, res, ['avatar']);
  } catch (error) {
    errorHandler(error, res);
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password || !validator.isEmail(email)) {
      throw new mongoose.Error.ValidationError();
    }

    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => {
        throw new ErrorLogin();
      });

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) throw new ErrorLogin();

    const { _id } = user;
    const token = generateToken(_id);

    res
      .status(http2Constants.HTTP_STATUS_OK)
      .cookie('access_token', `Bearer ${token}`, {
        expires: new Date(Date.now() + 7 * 24 * 3600000),
        httpOnly: true,
      })
      .send({ jwt: token });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function addNewUser(req, res) {
  try {
    const newUser = req.body;
    if (
      !newUser.email ||
      !newUser.password ||
      !validator.isEmail(newUser.email) ||
      (newUser.avatar && !validator.isURL(newUser.avatar))
    ) {
      throw new mongoose.Error.ValidationError();
    }

    newUser.password = await bcrypt.hash(newUser.password, SALT_ROUNDES);
    const user = await User.create(newUser);
    const { email, name, about, avatar } = user;
    res.status(http2Constants.HTTP_STATUS_CREATED).send({
      email,
      name,
      about,
      avatar,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function getUserInfo(req, res) {
  try {
    const user = await User.findById(req.user._id).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
}
