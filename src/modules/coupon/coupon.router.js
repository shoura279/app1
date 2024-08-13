import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";
import { createCouponVal } from "./coupon.validation.js";
import { createCoupon } from "./coupon.controller.js";
const couponRouter = Router()
// create coupon
couponRouter.post('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    isValid(createCouponVal),
    asyncHandler(createCoupon)
)
export default couponRouter