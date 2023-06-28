import { constants as http2Constants } from "node:http2";
import validator from "validator";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

function errorHandler(error, res) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: `${Object.values(error.errors)
        .map((err) => err.message)
        .join(", ")}`,
    });
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(http2Constants.HTTP_STATUS_NOT_FOUND).send({
      message: "Запрашиваемый пользователь не найден",
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: "Некорректный id",
    });
  }

  if (error.code === 11000) {
    return res.status(http2Constants.HTTP_STATUS_CONFLICT).send({
      message: "Поле с таким значением уже существует.",
    });
  }

  return res
    .status(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: "Server Error" });
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
  await update(req, res, ["name", "about"]);
};

export const updateUsersAvatar = async (req, res) => {
  await update(req, res, ["avatar"]);
};

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).orFail();
    if (user.password === password) {
      const _id = "d285e3dceed844f902650f40";
      const token = jwt.sign(
        { _id } /* { _id: user._id }, */, //! из примера тут _id
        "e041e9c9fbc63d5ba0de72298f8d8f54",
        { expiresIn: "7d" }
      ); //md5
      res
        .status(http2Constants.HTTP_STATUS_OK)
        .cookie("access_token", `Bearer ${token}`, {
          expires: new Date(Date.now() + 7 * 24 * 3600000),
          httpOnly: true,
        })
        .send({ _id, token: `Bearer ${token}` });
    } else {
      res
        .status(http2Constants.HTTP_STATUS_UNAUTHORIZED)
        .send("Неверный логин или пароль"); //! хардкод
    }
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function addNewUser(req, res) {
  try {
    const newUser = req.body;
    const validEm = validator.isEmail(newUser.email);
    if (validEm) {
      const user = await User.create(newUser);
      res.status(http2Constants.HTTP_STATUS_CREATED).send(user);
    } else {
      throw new mongoose.Error.ValidationError("Введите корректный email");
    }
  } catch (error) {
    errorHandler(error, res);
  }
}
