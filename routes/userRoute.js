import express from 'express';
const router = express.Router();

import {
   authUser,
   registerUser,

   deleteUser,
   updateUser,
   getUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(getUsers);
router.post('/login', authUser);


router.route('/:id').delete(protect, deleteUser).put(protect, updateUser);

export default router;
