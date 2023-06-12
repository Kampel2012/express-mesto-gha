/* eslint-disable import/extensions */
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648577eb507a479c8bb2b791',
  };

  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Данная страница не найдена' });
});

app.listen(PORT);
