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

    const cart = await cartRepository.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'The cart is empty' });
    }

    let totalAmount = 0;
    const successfulPurchases = [];
    const failedPurchases = [];

    for (const item of cart.items) {
      const product = await productRepository.getProductById(item.productId);
      
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productRepository.updateProduct(product.id, { stock: product.stock });
        
        totalAmount += product.price * item.quantity;
        successfulPurchases.push({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price: product.price
        });
      } else {
        failedPurchases.push({
          productId: item.productId,
          quantity: item.quantity,
          reason: product ? 'Insufficient stock' : 'Product not found'
        });
      }
    }

    if (successfulPurchases.length > 0) {
      const ticketData = {
        amount: totalAmount,
        purchaser: userEmail,
        products: successfulPurchases
      };
      const newTicket = await ticketRepository.createTicket(ticketData);

      cart.items = cart.items.filter(item => 
        failedPurchases.some(failedItem => failedItem.productId.toString() === item.productId.toString())
      );
      await cartRepository.updateCart(cartId, { items: cart.items });

      res.status(200).json({
        status: 'success',
        message: 'Purchase completed',
        ticket: newTicket,
        successfulPurchases,
        failedPurchases
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'No products were able to be purchased',
        failedPurchases
      });
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
});

router.post('/:cartId/items', authenticateUser, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const updatedCart = await cartRepository.addToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticateUser, authorizeUser, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    const userId = req.user.id;
    const newCart = await cartRepository.createCart(userId);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cart', error: error.message });
  }
});

router.get('/:cartId', authenticateUser, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartRepository.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    res.status(200).json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
});

router.delete('/:cartId/empty', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const emptiedCart = await cartRepository.emptyCart(cartId);

    if (!emptiedCart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cart emptied successfully',
      data: emptiedCart
    });
  } catch (error) {
    console.error('Error emptying cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
});

export default router;