import express from 'express';
const router = express.Router();
import {
   addOrderItems,
   getOrders,
   updateBill,
   updateBillToCheck,
} from '../controllers/billsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, getOrders);

router.route('/:id').put(protect, updateBill);
router.route('/:id/check').put(protect, updateBillToCheck);

export default router;
