import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import userRepository from '../repositories/user.repository.js';
import { createHash, generateToken } from '../utils/index.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await createHash(password);
    const newUser = await userRepository.createUser({ 
      first_name: firstName, 
      last_name: lastName, 
      email, 
      password: hashedPassword,
      role: role || 'user' 
    });
    const token = generateToken(newUser);
    res.cookie('token', token, { httpOnly: true }).json({ user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true }).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;