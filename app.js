import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import routes from './routes/index.js';
import { NotFoundError } from './errors/errors.js';
import handleError from './middlewares/handeError.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(limiter);

app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use('*', () => {
  throw new NotFoundError('Данная страница не найдена');
});

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT);
