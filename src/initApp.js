import { connectDB } from "../db/connection.js"
import brandRouter from "./modules/brand/brand.router.js"
import categoryRouter from "./modules/category/category.router.js"
import productRouter from "./modules/product/product.router.js"
import subcategoryRouter from "./modules/subcategory/subcategory.router.js"
import { globalErrorHandling } from "./utils/asyncHandler.js"

export const initApp = (app, express) => {

    app.use(express.json())
    app.use('/uploads', express.static('uploads'))

    connectDB()
    const port = process.env.PORT || 3000
    app.use('/category', categoryRouter)
    app.use('/sub-category', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/product', productRouter)
    app.use(globalErrorHandling)
    app.listen(port, () => console.log('server is running on port', port))
}