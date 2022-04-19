import asyncHandler from 'express-async-handler';
import Bills from '../models/billsModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
   const {
      orderItems,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      subTotal,
   } = req.body;

   if(paymentMethod)

   if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
      return;
   } else {
      const bills = new Bills({
         orderItems,
         user: req.user._id,
         paymentMethod,
         itemsPrice,
         taxPrice,
         totalPrice,
         subTotal,
      });

      const createBills = await bills.save();

      res.status(201).json(createBills);
   }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
   const bills = await Bills.find({}).populate('user', 'id name');
   res.json(bills);
});

export { addOrderItems, getOrders };
