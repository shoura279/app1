import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { cloudUpload } from "../../utils/multer.cloud.js";
import { isValid } from "../../middleware/validation.js";
import { createCategoryVal } from "./category.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createCategory, getCategory, deleteCategory, createCategoryCloud } from "./category.controller.js";

const categoryRouter = Router()
// create category >>> todo authentication 
categoryRouter.post('/',
    fileUpload({ folder: 'category' }).single('image'),
    isValid(createCategoryVal),
    asyncHandler(createCategory)
)
categoryRouter.post('/cloud',
    cloudUpload().single('image'),
    asyncHandler(createCategoryCloud)
)
categoryRouter.delete('/:categoryId', asyncHandler(deleteCategory))
categoryRouter.get('/:categoryId', asyncHandler(getCategory))
export default categoryRouter