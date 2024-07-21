import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
const parseArr = (value, helper) => {
    value = JSON.parse(value)
    const schema = joi.array().items(joi.string())
    const { error } = schema.validate(value, { abortEarly: false })
    if (error) {
        return helper('invalid array')
    }
    else {
        return true
    }
}
export const createProductVal = joi.object({
    title: generalFields.name.required(),
    description: generalFields.name.required(),
    category: generalFields.objectId.required(),
    subcategory: generalFields.objectId.required(),
    brand: generalFields.objectId.required(),
    price: joi.number().min(0).required(),
    discount: joi.number(),
    size: joi.array().items(joi.string()),
    colors: joi.array().items(joi.string()),
    stock: joi.number().min(0)
}).required()