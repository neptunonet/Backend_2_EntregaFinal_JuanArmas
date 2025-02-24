import cartDao from '../dao/cart.dao.js';
import CartDto from '../dto/cart.dto.js';
import productRepository from './product.repository.js';

class CartRepository {
  async addItemToCart(cartId, productId, quantity) {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const cart = await cartDao.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Si es un nuevo producto, añádelo al carrito
      cart.items.push({
        product: product._id,
        quantity: quantity
      });
    }

    // Actualiza el carrito
    const updatedCart = await cartDao.updateCart(cartId, { items: cart.items });
    return updatedCart;
  }

  async getCartByUserId(userId) {
    const cart = await cartDao.getCartByUserId(userId);
    return cart ? new CartDto(cart) : null;
  }

  async addToCart(userId, productId, quantity) {
    const updatedCart = await cartDao.addToCart(userId, productId, quantity);
    return new CartDto(updatedCart);
  }

  async removeFromCart(userId, productId) {
    const updatedCart = await cartDao.removeFromCart(userId, productId);
    return updatedCart ? new CartDto(updatedCart) : null;
  }

  async clearCart(userId) {
    const clearedCart = await cartDao.clearCart(userId);
    return clearedCart ? new CartDto(clearedCart) : null;
  }
  
  async updateCart(cartId, updateData) {
    const updatedCart = await cartDao.updateCart(cartId, updateData);
    return updatedCart ? new CartDto(updatedCart) : null;
  }
}

export default new CartRepository();