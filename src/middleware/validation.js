import joi from "joi"
import { AppError } from "../utils/appError.js"

export const generalFields = {
    name: joi.string(),
    email: joi.string().email(),
    password: joi.string().required(),
    rePassword: joi.string().valid(joi.ref('password')),
    objectId: joi.string().hex().length(24)
}
export const isValid = (schema) => {
    return (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        }
        const { error } = schema.validate(data, { abortEarly: true })
        if (error) {
            return next(new AppError(error.details, 400))
        }
        next()
    }
}