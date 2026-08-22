import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller",
        required:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Product"
    },
    status:{
        type:String,
        required:true,
        enum:["pending","in-progress","completed"],
        default: "pending"
    }
},{timestamps:true});

export const Order = mongoose.model("Order",orderSchema);