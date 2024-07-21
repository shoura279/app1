import { model, Schema } from "mongoose";

// schema
const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    logo: { type: String, required: true },
    createdBy: {
        type: Schema.Types.ObjectId, ref: 'User', required: false//todo true
    }
}, { timestamps: true })
// model
export const Brand = model('Brand', brandSchema)