import { Router } from 'express';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.js';
import productRepository from '../repositories/product.repository.js';

const router = Router();

// Rutas públicas
router.get('/', async (req, res) => {
  const products = await productRepository.getAllProducts();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await productRepository.getProductById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Rutas protegidas para administradores
router.post('/', authenticateUser, authorizeAdmin, async (req, res) => {
  const newProduct = await productRepository.createProduct(req.body);
  res.status(201).json(newProduct);
});

router.put('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  const updatedProduct = await productRepository.updateProduct(req.params.id, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  const deletedProduct = await productRepository.deleteProduct(req.params.id);
  if (deletedProduct) {
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export default router;