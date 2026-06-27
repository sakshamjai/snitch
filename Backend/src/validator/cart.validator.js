import { param, body, validationResult } from "express-validator";
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next();
}
export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid Product Id"),
    param("variantId").optional().isMongoId().withMessage("Invalid Variant Id"),
    body("quantity").optional().isInt({min: 1}).withMessage("quantity must be at least 1"),
    validateRequest
]

export const validateIncrement = [
    param("productId").isMongoId().withMessage("Invalid productId"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant id"),
    validateRequest
]