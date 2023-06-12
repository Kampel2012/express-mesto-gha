import User from '../models/userModel.js';

function errorHandler(error, res) {
  if (error.name === 'ValidationError') {
    return res.status(400).send({
      message: `${Object.values(error.errors)
        .map((err) => err.message)
        .join(', ')}`,
    });
  }

  if (error.message === 'Not found') {
    return res.status(404).send({
      message: 'Запрашиваемая карточка не найдена',
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
    if (req.params.userId.length <= 20) {
      res.status(400).send({ message: 'Некорректный id' });
      return;
    }
    const user = await User.findById(req.params.userId).orFail(() =>
      Error('Not found')
    );
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

export const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    ).orFail(() => Error('Not found'));
    res.status(200).send(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateUsersAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    ).orFail(() => Error('Not found'));
    res.status(200).send(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};
