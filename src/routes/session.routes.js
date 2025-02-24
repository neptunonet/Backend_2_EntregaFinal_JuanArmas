import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import userRepository from '../repositories/user.repository.js';
import { generateToken, invalidateToken } from '../utils/index.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    
    // Imprimir el token en la consola
    //console.log('Token generado:', token);

    res.cookie('token', token, { httpOnly: true }).json({ user, token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/current', authenticateUser, async (req, res) => {
  try {
    const currentUser = await userRepository.getCurrentUserById(req.user.id);
    if (currentUser) {
      res.json({ user: currentUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', authenticateUser, (req, res) => {
  try {
    // Obtener el token del usuario
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    // Invalidar el token
    invalidateToken(token);

    // Eliminar la cookie del token
    res.clearCookie('token');
        
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
});

export default router;