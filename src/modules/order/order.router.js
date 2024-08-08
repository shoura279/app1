import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const orderRouter = Router()

// create order
orderRouter.post('/',
    isAuthenticate(),
    isAuthorized(Object.values(roles)),
    asyncHandler(createOrder)
)
export default orderRouter