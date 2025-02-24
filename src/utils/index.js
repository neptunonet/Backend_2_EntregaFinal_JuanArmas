import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config/passport.config.js';

// Almacén de tokens invalidados (en memoria)
const invalidatedTokens = new Set();

export const createToken = (user) =>
  jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

export const verifyToken = (token) => {
  try {
    if (invalidatedTokens.has(token)) {
      return null; // Token invalidado
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const invalidateToken = (token) => {
  invalidatedTokens.add(token);
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