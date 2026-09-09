import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discountedPrice:{
        type: Number,
    },
    stock:{
        type:Number,
        required:true
    },
    images: {
        type: [
            {
                publicId: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 1;
            },
            message: "At least one image is required"
        }
    },
    isActive:{
        type:Boolean,
        default:true
    },
    categoryID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    sellerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller",
    }
},{timestamps:true});

export const Product = mongoose.model("Product",productSchema);