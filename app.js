import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import addOwnerMW from './middlewares/addOwner.js';

const { PORT = 3005 } = process.env;

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to db');
  });

app.use(bodyParser.json());

app.use(addOwnerMW);

app.use(routes);

app.listen(PORT);
