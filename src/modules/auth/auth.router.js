import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { login, signup, verifyAccount, forgetPassword, changPassword } from "./auth.controller.js";
import { isValid } from "../../middleware/validation.js";
import { loginVal } from "./auth.validation.js";

const authRouter = Router()

// sign up
authRouter.post('/signup', asyncHandler(signup))
authRouter.get('/verify-account', asyncHandler(verifyAccount))
authRouter.post('/login', isValid(loginVal), asyncHandler(login))
authRouter.post('/forget-password', asyncHandler(forgetPassword))
authRouter.put('/change-password', asyncHandler(changPassword))
export default authRouter