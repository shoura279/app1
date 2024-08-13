import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createSubcategoryVal = joi.object({
    name: generalFields.name.required(),
    category: generalFields.objectId.required(),
})