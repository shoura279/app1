import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { cloudUpload } from "../../utils/multer.cloud.js";
import { isValid } from "../../middleware/validation.js";
import { createCategoryVal } from "./category.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createCategory, getCategory, deleteCategory, createCategoryCloud } from "./category.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const categoryRouter = Router()
// create category 
categoryRouter.post('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({ folder: 'category' }).single('image'),
    isValid(createCategoryVal),
    asyncHandler(createCategory)
)
categoryRouter.post('/cloud',
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUpload().single('image'),
    asyncHandler(createCategoryCloud)
)
categoryRouter.delete('/:categoryId',
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    asyncHandler(deleteCategory)
)
categoryRouter.get('/:categoryId', asyncHandler(getCategory))
export default categoryRouter