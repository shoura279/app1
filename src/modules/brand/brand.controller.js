import { Brand } from "../../../db/models/brand.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { deleteFile } from "../../utils/deleteFile.js"

export const createBrand = async (req, res, next) => {
    // get data from req
    let { name } = req.body
    name = name.toLowerCase()
    // check file
    if (!req.file) {
        return next(new AppError(messages.file.required, 400))
    }
    // check existence
    const brandExist = await Brand.findOne({ name })// {},null
    if (brandExist) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.brand.alreadyExist, 409))
    }
    // prepare data
    const brand = new Brand({
        name,
        logo: req.file.path,
        // todo createdBy from token
    })
    const createdBrand = await brand.save()
    if (!createdBrand) {
        // remove image
        req.failImage = req.file.path
        return next(new AppError(messages.brand.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.brand.createdSuccessfully,
        success: true,
        data: createdBrand
    })
}

export const updateBrand = async (req, res, next) => {
    // GET DATA FROM REQ
    let { name } = req.body
    name = name.toLowerCase()
    const { brandId } = req.params
    // check brand id
    const brandExist = await Brand.findById(brandId)// {},null
    if (!brandExist) {
        // remove image
        req.failImage = req.file?.path
        return next(new AppError(messages.brand.notFound, 404))
    }
    if (name) {
        const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } })//{},null
        if (nameExist) {
            return next(new AppError(messages.brand.alreadyExist, 409))
        }
        brandExist.name = name
    }
    if (req.file) {
        // remove old image
        deleteFile(brandExist.logo)
        brandExist.logo = req.file.path
    }
    const updatedBrand = await brandExist.save()
    if (!updatedBrand) {
        req.failImage = req.file.path
        return next(new AppError(messages.brand.failToUpdate, 500))
    }
    return res.status(200).json({
        message: messages.brand.updatedSuccessfully,
        success: true,
        data: updatedBrand
    })
}