import Product from '../models/product.model.js';

export const calculateCartTotal = async function(next) {
  if (this.items && this.items.length > 0) {
    let total = 0;
    for (let item of this.items) {
      const product = await Product.findById(item.product);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    this.total = total;
  } else {
    this.total = 0;
  }
  next();
};