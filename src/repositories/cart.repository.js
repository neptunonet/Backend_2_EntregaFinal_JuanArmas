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

  async addToCart(userId, productId, quantity) {
    let cart = await cartDao.getCartByUserId(userId);
  
    if (!cart) {
      cart = await this.createCart(userId);
    }
  
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );
  
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  
    const updatedCart = await cartDao.updateCart(cart._id, { items: cart.items });
    return new CartDto(updatedCart);
  }

  async getCartByUserId(userId) {
    const cart = await cartDao.getCartByUserId(userId);
    return cart ? new CartDto(cart) : null;
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
    return await cartDao.createCart(userId);
  }

  async emptyCart(cartId) {
    const emptiedCart = await cartDao.emptyCart(cartId);
    return emptiedCart ? new CartDto(emptiedCart) : null;
  }

  
}

export default new CartRepository();