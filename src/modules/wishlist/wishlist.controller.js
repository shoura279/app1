import { Types } from "mongoose"
import { Product } from "../../../db/models/product.model.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

// add to wishlist
export const addToWishlist = async (req, res, next) => {
    // get data from req
    let { productId } = req.body
    productId = new Types.ObjectId(productId)
    const { authUser } = req
    // check product exist
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }

    const user = await User.findByIdAndUpdate(
        req.authUser._id,
        { $addToSet: { wishlist: productId } },
        { new: true }
    )// user.wishlist=[1,2,3]
    return res.status(200).json({
        message: messages.wishlist.addedSuccessfully,
        success: true,
        data: user
    })
}
export const deleteFromWishlist = async (req, res, next) => {
    // get data from req
    const { productId } = req.params
    const user = await User.findByIdAndUpdate(req.authUser._id, {
        $pull: { wishlist: productId }
    }, {
        new: true
    }).select('wishlist')
    return res.status(200).json({
        message: messages.wishlist.deletedSuccessfully,
        success: true,
        data: user
    })
}