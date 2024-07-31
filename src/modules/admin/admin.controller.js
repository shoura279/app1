import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { status } from "../../utils/constant/enums.js"
import cloudinary from "../../utils/cloudinary.js"

// add user
export const addUser = async (req, res, next) => {
    // get data from req
    const { userName, email, phone, role } = req.body
    // check user admin
    console.log({email});
    const userExist = await User.findOne({ email })// {} ,null
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409))
    }

    // upload image
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "users" })
        req.body.image = { secure_url, public_id }
    }
    const createdUser = await User.create({
        userName,
        email,
        phone,
        role,
        password: "e-commerce",
        status: status.VERIFIED,
        image: req.body.image
    })
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
    return res.status(201).json({
        message: messages.user.createdSuccessfully,
        success: true,
        date: createdUser
    })
}