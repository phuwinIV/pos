import express from 'express';
import Bills from '../models/billsModel.js';
import { addOrderItems, getOrders } from '../controllers/billsController.js';
const router = express.Router();

import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, getOrders);

export default router;
