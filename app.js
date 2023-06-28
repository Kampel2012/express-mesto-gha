import { constants as http2Constants } from "node:http2";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import { login, addNewUser } from "./controllers/usersControllers.js";
import midllewareAuth from "./middlewares/auth.js";

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("bd active"));

app.use(express.json());

app.post("/signin", login);
app.post("/signup", addNewUser);

app.use(midllewareAuth);

app.use(routes);

app.use((req, res) => {
  res
    .status(http2Constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: "Данная страница не найдена" });
});

app.listen(PORT);
