import cartDao from '../dao/cart.dao.js';
import CartDto from '../dto/cart.dto.js';
import productRepository from './product.repository.js';

class CartRepository {

  async getCartById(cartId) {
    const cart = await cartDao.getCartById(cartId);
    return cart ? new CartDto(cart) : null;
  }

  async getCartByUserId(userId) {
    const cart = await cartDao.getCartByUserId(userId);
    return cart ? new CartDto(cart) : null;
  }

  async createCart(userId) {
    const newCart = await cartDao.createCart(userId);
    return new CartDto(newCart);
  }

  async updateCart(cartId, updateData) {
    const updatedCart = await cartDao.updateCart(cartId, updateData);
    return new CartDto(updatedCart);
  }

  async addItemToCart(cartId, productId, quantity) {
    const cart = await cartDao.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Si es un nuevo producto, añádelo al carrito
      cart.items.push({
        productId: productId,
        quantity: quantity
      });
    }

    // Actualiza el carrito
    const updatedCart = await cartDao.updateCart(cartId, { items: cart.items });
    return new CartDto(updatedCart);
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

  async createCart(userId) {
    console.log('Repository creating cart for user:', userId); // Para depuración
    return await cartDao.createCart(userId);
  }



  
}

export default new CartRepository();