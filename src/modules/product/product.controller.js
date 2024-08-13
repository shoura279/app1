import slugify from "slugify"
import { Brand } from "../../../db/models/brand.model.js"
import { Category } from "../../../db/models/category.model.js"
import { Subcategory } from "../../../db/models/subcategory.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Product } from "../../../db/models/product.model.js"
import { ApiFeature } from "../../utils/apiFeature.js"

export const createProduct = async (req, res, next) => {
    // return res.json(req.files)
    // get data from req
    const { title,
        description,
        category,
        subcategory,
        brand,
        price,
        discount,
        size,
        colors,
        stock } = req.body
    // check category existence
    const categoryExist = await Category.findById(category)// {},null
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // check subcategory existence
    const subcategoryExist = await Subcategory.findById(subcategory)// {},null
    if (!subcategoryExist) {
        return next(new AppError(messages.subcategory.notFound, 404))
    }
    // check brand existence
    const brandExist = await Brand.findById(brand)// {},null
    if (!brandExist) {
        return next(new AppError(messages.brand.notFound, 404))
    }
    // prepare data
    const slug = slugify(title)//-
    const product = new Product({
        title,
        slug,
        mainImage: req.files.mainImage[0].path,
        subImages: req.files.subImages.map(img => img.path),
        description,
        category,
        subcategory,
        brand,
        price,
        discount,
        size: size,//JSON.parse(size),
        colors: colors,//JSON.parse(colors),
        stock,
        // todo createdBy updatedBy
    })
    const createdProduct = await product.save()
    if (!createProduct) {
        return next(new AppError(messages.product.failToCreate))
    }
    return res.status(201).json({
        message: messages.product.createdSuccessfully,
        success: true,
        data: createdProduct
    })
}
// pagination ✅ sort ✅ select ✅ filter
export const getProducts = async (req, res, next) => {
    const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
    const products = await apiFeature.mongooseQuery
    return res.json({ success: true, data: products })
}