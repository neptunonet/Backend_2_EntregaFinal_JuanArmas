import mongoose from 'mongoose';
import { calculateCartTotal } from '../middlewares/cartTotalCalculator.js';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  total: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.pre(['save', 'findOneAndUpdate'], calculateCartTotal);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;