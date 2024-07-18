import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { createCategoryVal } from "./category.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createCategory,getCategory } from "./category.controller.js";

const categoryRouter = Router()
// create category >>> todo authentication 
categoryRouter.post('/',
    fileUpload({ folder: 'category' }).single('image'),
    isValid(createCategoryVal),
    asyncHandler(createCategory)
)

categoryRouter.get('/:categoryId', asyncHandler(getCategory))
export default categoryRouter