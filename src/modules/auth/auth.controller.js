
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { comparePassword, hashPassword } from '../../utils/hash-and-compare.js'
import { sendEmail } from '../../utils/email.js'
import { generateToken, verifyToken } from "../../utils/token.js"
import { status } from "../../utils/constant/enums.js"
import { Cart } from "../../../db/index.js"
export const signup = async (req, res, next) => {
    // get data from req
    let { userName, email, password, phone, DOB } = req.body
    // check existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409))
    }
    // prepare data
    password = hashPassword({ password })
    const user = new User({
        userName,
        email,
        phone,
        password,
    })

    // save to db
    const createdUser = await user.save()
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
    // send email
    const token = generateToken({ payload: { _id: createdUser._id } })
    await sendEmail({
        to: email, subject: "verify account", html: `<p>to verify your account click 
        <a href='${req.protocol}://${req.headers.host}/auth/verify-account?token=${token}'>link</a> 
        </p>`
    })
    return res.status(201).json({
        message: messages.user.createdSuccessfully,
        data: createdUser,
        success: true
    })
}

export const verifyAccount = async (req, res, next) => {
    // get data from req
    const { token } = req.query
    const decode = verifyToken({ token })
    const user = await User.findByIdAndUpdate(decode._id, { status: status.VERIFIED }, { new: true })
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    await Cart.create({ user: user._id, products: [] })
    return res.status(200).json({
        message: messages.user.verifyAccount,
        success: true
    })
}

export const login = async (req, res, next) => {
    // get data from req
    const { email, password, phone } = req.body
    // check existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }], status: status.VERIFIED })
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // check password
    const match = comparePassword({ password, hashPassword: userExist.password })
    if (!match) {
        return next(new AppError(messages.password.invalidCredential, 401))
    }
    userExist.isActive = true;
    await userExist.save()
    const accessToken = generateToken({ payload: { _id: userExist._id } })
    return res.status(200).json({ message: 'login successfully', success: true, accessToken })
}