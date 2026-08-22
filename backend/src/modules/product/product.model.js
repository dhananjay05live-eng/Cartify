import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:trusted
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
    images:{
        type:[String],
        required:true,
        message:"atleas one url required"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    categoryID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:trusted
    },
    sellerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller",
        required:true
    }
},{timestamps:true});

export const Product = mongoose.model("Product",productSchema);