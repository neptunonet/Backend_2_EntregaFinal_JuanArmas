import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config/passport.config.js';

export const createToken = (user) =>
  jwt.sign(user, "clave-secreta", { expiresIn: '24h' });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, "clave-secreta");
  } catch (error) {
    return null;
  }
};

export const hashPassword = (password) => hashSync(password, genSaltSync(10));

export const createHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const isValidPassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};