import Stripe from "stripe"
import { Cart, Coupon, Order, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { orderStatus } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"

export const createOrder = async (req, res, next) => {
    // get data from req
    const { address, phone, coupon, payment } = req.body
    let couponExist = ''
    if (coupon) {
        // check coupon
        couponExist = await Coupon.findOne({ couponCode: coupon })// {} , null
        if (!couponExist) {
            return next(new AppError(messages.coupon.notFound, 404))
        }
        if (couponExist.fromDate > Date.now() || couponExist.toDate < Date.now()) {
            return next(new AppError('invalid coupon', 404))
        }
    }
    // check cart
    const cart = await Cart.findOne({ user: req.authUser._id }).populate('products.productId')// {},null
    const products = cart.products
    if (products.length <= 0) {
        return next(new AppError('cart empty', 400))
    }
    // check products
    let orderProducts = []
    let orderPrice = 0
    for (const product of products) {
        const productExist = await Product.findById(product.productId)
        if (!productExist) {
            return next(new AppError(messages.product.notFound, 404))
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new AppError('out of stock'))
        }
        orderProducts.push({
            productId: productExist._id,
            title: productExist.title,
            itemPrice: productExist.finalPrice,
            quantity: product.quantity,
            finalPrice: product.quantity * productExist.finalPrice,
        })
        orderPrice += product.quantity * productExist.finalPrice
    }
    const order = new Order({
        user: req.authUser._id,
        products: orderProducts,
        address,
        phone,
        coupon: {
            couponId: couponExist?._id,
            code: couponExist?.couponCode,
            discount: couponExist?.couponAmount
        },
        status: orderStatus.PLACED,
        payment,
        orderPrice,
        finalPrice: orderPrice - (orderPrice * ((couponExist?.couponAmount || 0) / 100))
    })
    // save to db
    const orderCreated = await order.save()
    if (payment == 'visa') {
        const stripe = new Stripe(process.env.STRIPE_KEY)
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ['card'],
            success_url: 'https://google.com',
            cancel_url: "https://www.facebock.com",
            client_reference_id: cart._id.toString(),
            metadata: {
                orderID: orderCreated._id.toString()
            },
            line_items: orderCreated.products.map(product => {
                return {
                    price_data: {
                        currency: 'egp',
                        product_data: {
                            name: product.title,
                            // images:product.
                        },
                        unit_amount: product.itemPrice * 100
                    },
                    quantity: product.quantity
                }
            })
        })
        return res.status(200).json({ message: 'order created successfully', success: true, url: session.url })
    }
    return res.status(201).json({ message: 'order created successfully', success: true })
}
// change order status
// 4000.0