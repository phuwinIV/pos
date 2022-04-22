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

   if (paymentMethod)
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
            isPaid: true,
         });

         const createBills = await bills.save();

         res.status(201).json(createBills);
      }
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateBill = asyncHandler(async (req, res) => {
   try {
      const bill = await Bills.findByIdAndUpdate(req.params.id);

      if (bill) {
         bill.isPaid = false;
      }
      await bill.save();

      res.status(200).send('Bill updated');
   } catch (error) {
      res.status(400).json(error);
   }
});

const updateBillToCheck = asyncHandler(async (req, res) => {
   try {
      const bill = await Bills.findByIdAndUpdate(req.params.id);

      if (bill) {
         bill.isPaid = true;
      }
      await bill.save();

      res.status(200).send('Bill updated');
   } catch (error) {
      res.status(400).json(error);
   }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
   const bills = await Bills.find({}).populate('user', 'id name');
   res.json(bills);
});

export { addOrderItems, getOrders, updateBill, updateBillToCheck };
