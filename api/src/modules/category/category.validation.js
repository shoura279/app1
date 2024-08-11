import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// create category val
export const createCategoryVal = joi.object({
    name: generalFields.name, 
}).required()