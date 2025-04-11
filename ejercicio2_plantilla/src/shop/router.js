// router.js

import express from 'express';
import { ShopController } from './controller.js';

const router = express.Router();

// Rutas de productos
router.post('/add', ShopController.addProduct);  // Añadir un producto
router.get('/', ShopController.getAllProducts);  // Obtener todos los productos
router.get('/:id', ShopController.getProductById);  // Obtener un producto por ID
router.put('/:id/sell', ShopController.sellProduct);  // Marcar un producto como vendido
router.delete('/:id', ShopController.deleteProduct);  // Eliminar un producto

export default router;
