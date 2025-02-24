class CartDto {
  constructor(cart) {
    this.id = cart._id;
    this.userId = cart.userId;
    this.items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      name: item.name,
      price: item.price
    }));
    this.total = this.calculateTotal();
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export default CartDto;