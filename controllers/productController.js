import Product from '../models/productsModel.js';
import asyncHandler from 'express-async-handler';

// @desc Fetch All products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
   const products =  await Product.find().sort({ category: 1 });
   res.status(200).send(products);
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id);

   if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
   } else {
      res.status(404);
      throw new Error('Product not found');
   }
});

// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
   const product = new Product(req.body);

   const createdProduct = await product.save();
   res.status(201).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
   const { name, price, image, category, countInStock } = req.body;

   const product = await Product.findById(req.params.id);

   if (product) {
      product.name = name;
      product.price = price;
      product.image = image;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.status(201).json(updatedProduct);
   } else {
      res.status(404);
      throw new Error('Product not found');
   }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id);

   if (product) {
      res.json(product);
   } else {
      res.status(404);
      throw new Error('Product not found');
   }
});

export {
   getProducts,
   deleteProduct,
   createProduct,
   updateProduct,
   getProductById,
};
