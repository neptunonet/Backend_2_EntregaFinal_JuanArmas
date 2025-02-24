import productDao from '../dao/product.dao.js';
import ProductDto from '../dto/product.dto.js';

class ProductRepository {
  async getAllProducts() {
    const products = await productDao.getAllProducts();
    return products.map(product => new ProductDto(product));
  }

  async getProductById(id) {
    const product = await productDao.getProductById(id);
    return product ? new ProductDto(product) : null;
  }

  async createProduct(productData) {
    const product = await productDao.createProduct(productData);
    return new ProductDto(product);
  }

  async updateProduct(id, productData) {
    const product = await productDao.updateProduct(id, productData);
    return product ? new ProductDto(product) : null;
  }

  async deleteProduct(id) {
    return await productDao.deleteProduct(id);
  }
}

export default new ProductRepository();