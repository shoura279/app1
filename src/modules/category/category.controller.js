import slugify from 'slugify'
import { Types } from 'mongoose'
import { Category } from "../../../db/models/category.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Subcategory } from '../../../db/models/subcategory.model.js'
import { Product } from '../../../db/models/product.model.js'
import { deleteFile } from '../../utils/deleteFile.js'
import cloudinary from '../../utils/cloudinary.js'

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

export const deleteCategory = async (req, res, next) => {
    // get data from req
    const { categoryId } = req.params
    // check existence
    const categoryExist = await Category.findByIdAndDelete(categoryId)// {}, null
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // prepare ids
    const subcategories = await Subcategory.find({ category: categoryId }).select('image')
    const products = await Product.find({ category: categoryId }).select('mainImage subImages')
    const imagePaths = []


    const subcategoryIds = subcategories.map(sub => {
        imagePaths.push(sub.image)
        return sub._id;
    })//[1,2,3,4]
    const productIds = products.map(prod => {
        imagePaths.push(prod.mainImage);
        imagePaths.push(...prod.subImages)
        return prod._id;
    })//[1,2,3]
    // delete subcategories
    await Subcategory.deleteMany({ _id: { $in: subcategoryIds } })
    await Product.deleteMany({ _id: { $in: productIds } })
    // delete images
    // const imagePaths = subcategories.map(sub => sub.image)//['']
    // for (let i = 0; i < products.length; i++) {
    //     imagePaths.push(products[i].mainImage)
    //     imagePaths.push(...products[i].subImages)
    // }
    for (let i = 0; i < imagePaths.length; i++) {
        deleteFile(imagePaths[i])
    }

}

export const createCategoryCloud = async (req, res, next) => {
    // get data from req
    let { name } = req.body
    name = name.toLowerCase()
    // check existence
    const categoryExist = await Category.findOne({ name })// {},null
    if (categoryExist) {
        return next(new AppError(messages.category.alreadyExist, 409))
    }
    // prepare data
    const slug = slugify(name)
    console.log(req.file?.path);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file?.path, {
        folder: 'c42/category',
    })
    const category = new Category({
        name,
        slug,
        image: { secure_url, public_id }
        // todo >>>> createdBy
    })
    // add to db
    const createdCategory = await category.save()
    if (!createdCategory) {
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response
    return res.status(201).json({ message: messages.category.createdSuccessfully, success: true, data: createdCategory })
}

export const deleteCategoryCloud = async (req, res, next) => async (req, res, next) => {
    // get data from req
    const { categoryId } = req.query
    // check existence
    const categoryExist = await Category.findByIdAndDelete(categoryId)// {}, null
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // prepare ids
    const subcategories = await Subcategory.find({ category: categoryId }).select('image')
    const products = await Product.find({ category: categoryId }).select('mainImage subImages')
    const imagePaths = []


    const subcategoryIds = []
    subcategories.forEach(sub => {
        imagePaths.push(sub.image)
        subcategoryIds.push(sub._id)
    })//[1,2,3,4]
    const productIds = []
    products.forEach(prod => {
        imagePaths.push(prod.mainImage);
        imagePaths.push(...prod.subImages)
        productIds.push(prod._id);
    })//[1,2,3]
    // delete subcategories
    await Subcategory.deleteMany({ _id: { $in: subcategoryIds } })
    await Product.deleteMany({ _id: { $in: productIds } })
    // delete images
    // const imagePaths = subcategories.map(sub => sub.image)//['']
    // for (let i = 0; i < products.length; i++) {
    //     imagePaths.push(products[i].mainImage)
    //     imagePaths.push(...products[i].subImages)
    // }
    for (let i = 0; i < imagePaths.length; i++) {
        if (typeof (imagePaths[i]) === "string") {
            deleteFile(imagePaths[i])
        }
        else {
            await cloudinary.uploader.destroy(imagePaths[i].public_id)
        }
    }
    // another sol >>> delete folder
    await cloudinary.api.delete_resources_by_prefix(`c42/category/${categoryId}`)
    await cloudinary.api.delete_folder(`c42/category/${categoryId}`)
}

export const updateCategoryCloud = async (req, res, next) => {
    const { categoryId } = req.params
    const category = await Category.findById(categoryId)
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { public_id: category.image.public_id })
        req.body.image = { secure_url, public_id }
    }

    category.name = req.body.name || category.name
    category.image = req.body.image || category.image// {secure_}
    await category.save()
    return res.json('done')
}