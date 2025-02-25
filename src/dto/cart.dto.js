class CartDto {
  constructor(cart) {
    this.id = cart._id;
    this.userId = cart.userId;
    this.items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    this.total = cart.total;
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
  }
}

export default CartDto;