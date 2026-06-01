import express from 'express';
import { createProduct, getAllProducts, getSellerProducts } from '../controllers/product.controller.js';
import { createProductValidator} from '../validator/product.validator.js';
import { authenticateSeller, authenticateUser } from '../middlewares/auth.middleware.js';
import multer, { memoryStorage } from 'multer';
const upload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 1024*1024*5
    }
})
const router = express.Router();
router.post('/', authenticateSeller, upload.array('images', 7), createProductValidator ,createProduct);
router.get("/seller", authenticateSeller, getSellerProducts);
router.get('/', getAllProducts);

export default router;