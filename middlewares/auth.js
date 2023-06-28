import jwt from "jsonwebtoken";
import { constants as http2Constants } from "node:http2";

const SECRET_KEY = "e041e9c9fbc63d5ba0de72298f8d8f54";

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return res
      .status(http2Constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next();
}
