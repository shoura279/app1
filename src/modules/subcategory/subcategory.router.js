import { Router } from "express";
import { createSubcategoryVal } from "./subcategory.validation.js";
import { createSubcategory, getSubcategories } from "./subcategory.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const subcategoryRouter = Router();
// create subcategory
subcategoryRouter.post('/',
    fileUpload({ folder: 'subcategory' }).single('image'),
    isValid(createSubcategoryVal),
    asyncHandler(createSubcategory)
)
subcategoryRouter.get('/:categoryId', asyncHandler(getSubcategories))
export default subcategoryRouter