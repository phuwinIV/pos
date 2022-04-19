import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
   getProducts,
   deleteProduct,
   createProduct,
   updateProduct,
} from '../controllers/productController.js';

const router = express.Router();
router.route('/').get(getProducts).post(protect, createProduct);
router.route('/:id').delete(protect, deleteProduct).put(protect, updateProduct);

export default router;
