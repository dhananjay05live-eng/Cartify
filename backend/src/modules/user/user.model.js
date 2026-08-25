import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        select:false
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    refreshToken:{
        type:String
    }

},{timestamps:true});


userSchema.pre('save', async function(){
    try {
        if(!this.isModified("password")){
            return;
        }
        this.password = await argon2.hash(this.password);
      } catch (error) {
        console.log('password hashing failed error',error)
        throw error
      }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await argon2.verify(this.password ,password)
      } catch (error) {
        console.log("error while veryfying",error)
        throw error
      }
}

export const User = mongoose.model("User",userSchema);