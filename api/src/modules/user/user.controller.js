import { User } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { comparePassword, hashPassword } from "../../utils/hash-and-compare.js"

export const resetPassword = async (req, res, next) => {
    // get data from req
    const { oldPassword, newPassword } = req.body
    const userId = req.authUser._id
    // check user password
    const match = comparePassword({ password: oldPassword, hashPassword: req.authUser.password })
    if (!match) {
        return next(new AppError(messages.password.invalidCredential, 401))
    }
    // hash password
    const hashedPassword = hashPassword({ password: newPassword })
    // update user
    await User.updateOne({ _id: userId }, { password: hashedPassword })
    // send response
    return res.status(200).json({ message: messages.user.updatedSuccessfully, success: true })
}