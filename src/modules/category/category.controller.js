import slugify from 'slugify'
import { Types } from 'mongoose'
import { Category } from "../../../db/models/category.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

export const createCategory = async (req, res, next) => {
    // get data from req
    let { name } = req.body
    name = name.toLowerCase()
    // check existence
    const categoryExist = await Category.findOne({ name })// {},null
    if (categoryExist) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.category.alreadyExist, 409))
    }
    // prepare data
    const slug = slugify(name)
    console.log(req.file.path);
    const category = new Category({
        name,
        slug,
        image: req.file.path,
        // todo >>>> createdBy
    })
    // add to db
    const createdCategory = await category.save()
    if (!createdCategory) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response
    return res.status(201).json({ message: messages.category.createdSuccessfully, success: true })
}

export const getCategory = async (req, res, next) => {
    // get data from req
    const { categoryId } = req.params
    // check existence
    //--1 // const category = await Category.findById(categoryId).populate([{ path: "subcategories" }])// {},null
    //--2 using aggregate
    const category = await Category.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(categoryId)
            }
        },
        {
            $lookup: {
                from: "subcategories",
                localField: '_id',
                foreignField: "category",
                as: "subcategories"
            }
        }
    ])
    category ?
        res.status(200).json({ date: category, success: true })
        : next(new AppError(messages.category.notFound, 404))
}