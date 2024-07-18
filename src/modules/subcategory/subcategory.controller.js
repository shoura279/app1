import slugify from "slugify"
import { Category } from "../../../db/models/category.model.js"
import { Subcategory } from "../../../db/models/subcategory.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from '../../utils/constant/messages.js'
export const createSubcategory = async (req, res, next) => {
    // get data from req
    const { name, category } = req.body
    // check category existence
    const categoryExist = await Category.findById(category)// {},null
    if (!categoryExist) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.category.notFound, 404))
    }
    // check subcategory existence
    const subcategoryExist = await Subcategory.findOne({ name })// {},null
    if (subcategoryExist) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.subcategory.alreadyExist, 409))
    }
    // prepare data
    const slug = slugify(name)
    const subcategory = new Subcategory({
        name,
        slug,
        category,
        image: req.file.path
    })
    // add to db
    const createdSubcategory = await subcategory.save()
    if (!createdSubcategory) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.subcategory.failToCreate, 500))
    }
    // send response
    return res.status(201).json({ message: messages.subcategory.createdSuccessfully, success: true })
}

export const getSubcategories = async (req, res, next) => {
    // get data from req
    const { categoryId } = req.params
    // check category existence
    const categoryExist = await Category.findById(categoryId)// {},null
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // get subcategories
    const subcategories = await Subcategory.find({ category: categoryId }, {}, { populate: [{ path: 'category' }] })
    return res.status(200).json({ data: subcategories, success: true })
}