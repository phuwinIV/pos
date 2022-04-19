import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc  Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
   const { userId, password } = req.body;

   const user = await User.findOne({ userId });

   if (user && (await user.matchPassword(password))) {
      res.json({
         _id: user._id,
         name: user.name,
         userId: user.userId,
         token: generateToken(user._id),
      });
   } else {
      res.status(401);
      throw new Error('Invalid email or password');
   }
});

// @desc  Register a new users
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
   const values = req.body;
   const { name, userId, password, number } = values;

   const userExists = await User.findOne({ userId });

   if (userExists) {
      res.status(400);
      throw new Error('User alreadt exists');
   }

   const user = await User.create({
      name,
      userId,
      password,
      number,
   });

   if (user) {
      res.status(201).json({
         _id: user._id,
         name: user.name,
         userId: user.userId,
         number: user.number,
         token: generateToken(user._id),
      });
   } else {
      res.status(400);
      throw new Error('Invalid user Data');
   }
});

// @desc  GET all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
   const users = await User.find({}).select('-password');
   res.json(users);
});

// @desc  Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
   const user = await User.findById(req.params.id);

   if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
   } else {
      res.status(404);
      throw new Erorr('User not found');
   }
});

// @desc  Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
   const values = req.body;
   const { name, userId, password, number, _id } = values;

   const user = await User.findById(req.params.id);
   console.log(user);

   if (user) {
      user.name = name || user.name;
      user.userId = userId || user.userId;
      user.number = number || user.number;

      const updatedUser = await user.save();

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         number: updateUser.number,
         userId: updatedUser.userId,
      });
   } else {
      res.status(404);
      throw new Error('User not found');
   }
});

export { authUser, registerUser, getUsers, deleteUser, updateUser };
