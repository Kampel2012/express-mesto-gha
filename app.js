import { constants as http2Constants } from 'node:http2';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import routes from './routes/index.js';
import { NotFoundError } from './errors/errors.js';

import handleError from './middlewares/handeError.js';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());

app.use(routes);

app.use('*', (req, res) => {
  throw new NotFoundError('Данная страница не найдена');
});

app.use(errors());
app.use(handleError);

app.listen(PORT);
