import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    storeName:{
        type:String,
        required:true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    address:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Address",
        required:true
    }

},{timestamps:true})

export const Seller = mongoose.model("Seller",sellerSchema);