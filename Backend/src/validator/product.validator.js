import { body, validationResult } from "express-validator";
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
export const createProductValidator = [
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('priceAmount').isNumeric().withMessage('priceAmount must  be a number'),
    body('priceCurrency').notEmpty().withMessage("priceCurrency is required")
        .isIn(["USD", "EUR", "GBP", "JPY", "INR"]).withMessage("priceCurrency must be one of USD, EUR, GBP, JPY, INR"),
    validateResult
]