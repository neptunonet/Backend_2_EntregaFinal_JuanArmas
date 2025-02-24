import cartDao from '../dao/cart.dao.js';
import CartDto from '../dto/cart.dto.js';

class CartRepository {
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