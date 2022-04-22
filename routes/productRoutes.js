import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
   getProducts,
   deleteProduct,
   createProduct,
   updateProduct,
   getProductById,
} from '../controllers/productController.js';

const router = express.Router();
router.route('/').get(getProducts).post(protect, createProduct);
router
   .route('/:id')
   .delete(protect, deleteProduct)
   .get(getProductById)
   .put(protect, updateProduct);

export default router;
