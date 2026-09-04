import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const sellerSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        trim: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["pending", "active", "inactive"],
        default: "pending",
        required: true
    },

    logo: {
        type: imageSchema,
        required: true
    },

    coverPage: {
        type: imageSchema
    }

}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);