import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addToCart } from "./cart.controller.js";
const cartRouter = Router()
// add to cart
cartRouter.post('/',
    isAuthenticate(),
    asyncHandler(addToCart)
)
export default cartRouter