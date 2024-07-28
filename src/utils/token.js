import jwt from "jsonwebtoken"
export const generateToken = ({ payload = {}, secretKey = process.env.secretKey, expiresIn = '1h' }) => {
    return jwt.sign(payload, secretKey, { expiresIn })
}

export const verifyToken = ({ token, secretKey = process.env.secretKey
}) => {
    return jwt.verify(token, secretKey)
}

