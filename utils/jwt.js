import jwt from 'jsonwebtoken';

const SECRET_KEY = 'e041e9c9fbc63d5ba0de72298f8d8f54';

export function generateToken(_id) {
  return jwt.sign({ _id }, SECRET_KEY, {
    expiresIn: '7d',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
