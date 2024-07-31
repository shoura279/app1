import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addToWishlist, deleteFromWishlist } from "./wishlist.controller.js";
const wishlistRouter = Router()

// add to wishlist
wishlistRouter.put('/',
    isAuthenticate(),
    asyncHandler(addToWishlist)
)

wishlistRouter.put('/:productId', isAuthenticate(), asyncHandler(deleteFromWishlist))
export default wishlistRouter