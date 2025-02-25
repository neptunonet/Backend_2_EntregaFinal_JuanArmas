import { Router } from 'express';
import { authenticateUser, authorizeUser } from '../middlewares/auth.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import ticketRepository from '../repositories/ticket.repository.js';


const router = Router();

router.get('/', authenticateUser, async (req, res) => {
  const cart = await cartRepository.getCartByUserId(req.user.id);
  res.json(cart);
});

router.post('/add', authenticateUser, authorizeUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const updatedCart = await cartRepository.addToCart(req.user.id, productId, quantity);
  res.json(updatedCart);
});

router.post('/:cid/purchase', authenticateUser, async (req, res) => {
  try {
    const cartId = req.params.cid;
    const userEmail = req.user.email;

    // Obtener el carrito
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let totalAmount = 0;
    const successfulPurchases = [];
    const failedPurchases = [];

    // Procesar cada item en el carrito
    for (const item of cart.items) {
      const product = await productRepository.getProductById(item.productId);
      
      if (product && product.stock >= item.quantity) {
        // Suficiente stock, proceder con la compra
        product.stock -= item.quantity;
        await productRepository.updateProduct(product.id, { stock: product.stock });
        
        totalAmount += product.price * item.quantity;
        successfulPurchases.push(item);
      } else {
        // Stock insuficiente
        failedPurchases.push(item.productId);
      }
    }

    // Crear ticket si hay compras exitosas
    if (successfulPurchases.length > 0) {
      const ticketData = {
        amount: totalAmount,
        purchaser: userEmail
      };
      const newTicket = await ticketRepository.createTicket(ticketData);

      // Actualizar el carrito para mantener solo los productos no comprados
      cart.items = cart.items.filter(item => failedPurchases.includes(item.productId.toString()));
      await cartRepository.updateCart(cartId, { items: cart.items });

      res.status(200).json({
        status: 'success',
        message: 'Purchase completed',
        ticket: newTicket,
        failedPurchases: failedPurchases
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'No products were able to be purchased',
        failedPurchases: failedPurchases
      });
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/:cartId/items', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const updatedCart = await cartRepository.addItemToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

router.post('/', authenticateUser, authorizeUser, async (req, res) => {
  try {
    //console.log('User from request:', req.user); // Para depuración
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    const userId = req.user.id;
    //console.log('Creating cart for user:', userId);
    const newCart = await cartRepository.createCart(userId);
    res.status(201).json(newCart);
  } catch (error) {
    //console.error('Error creating cart:', error);
    res.status(500).json({ message: 'Error creating cart', error: error.message });
  }
});

export default router;