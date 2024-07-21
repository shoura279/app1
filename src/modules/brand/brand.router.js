import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, updateBrandVal } from "./brand.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createBrand,updateBrand } from "./brand.controller.js";
const brandRouter = Router()

// create brand // todo is Authentication
brandRouter.post('/',
    fileUpload({ folder: "brand" }).single('logo'),
    isValid(createBrandVal),
    asyncHandler(createBrand)
)
// update brand // todo Authentication
brandRouter.put('/:brandId',
    fileUpload({ folder: "brand" }).single('logo'),
    isValid(updateBrandVal),
    asyncHandler(updateBrand)
)
export default brandRouter