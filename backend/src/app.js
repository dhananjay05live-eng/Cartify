import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.router.js";
import { sellerRouter } from "./modules/seller/seller.router.js";
import { productRouter } from "./modules/product/product.router.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/user',userRouter);

app.use('/api/v1/seller',sellerRouter);

app.use('/api/v1/product',productRouter);


app.get('/home',(req,res)=>{
 res.send("HOME")
})

export{app}