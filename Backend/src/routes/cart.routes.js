import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart, validateIncrement  } from '../validator/cart.validator.js';
import { addToCart, getCart, increment } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCart);
router.get('/get', authenticateUser, getCart);
router.patch('/quantity/increment/:productId/:variantId', authenticateUser, validateIncrement, increment);
export default router;