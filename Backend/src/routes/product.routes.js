import express from 'express';
import { createProduct } from '../controllers/product.controller.js';
import { createProductValidator} from '../validator/product.validator.js';
import authenticateSeller from '../middlewares/auth.middleware.js';
import multer, { memoryStorage } from 'multer';
const upload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 1024*1024*5
    }
})
const router = express.Router();
router.post('/', authenticateSeller, upload.array('images', 7), createProductValidator ,createProduct);
export default router;