import mongoose, { trusted } from "mongoose"

const addressSchema = new mongoose.Schema(
    {
        country:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        district:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        street:{
            type:String,
            required:true
        },
        landmark:{
            type:String,
            required:true
        },
        houseNO:{
            type:String,
            required:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    }
);

export const Address = mongoose.model("Address",addressSchema);