import Cart from '../models/cart.model.js';

class CartDao {
  async getCartByUserId(userId) {
    return await Cart.findOne({ userId });
  }

  async addToCart(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = new Cart({ userId, items: [{ productId, quantity }] });
      return await newCart.save();
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    return await cart.save();
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    return await cart.save();
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    cart.items = [];
    return await cart.save();
  }

  async updateCart(cartId, updateData) {
    return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
  }

  async createCart(userId) {
    //console.log('DAO creating cart for user:', userId); // Para depuración
    const newCart = new Cart({
      userId,
      items: []
    });
    return await newCart.save();
  }

  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('items.productId');
  }

  async updateCart(cartId, updateData) {
    return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
  }
  async getCartByUserId(userId) {
    return await Cart.findOne({ userId });
  }
  
  async emptyCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.items = [];
    return await cart.save();
  }

}






export default new CartDao();