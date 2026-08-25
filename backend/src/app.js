import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.router.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/user',userRouter);


app.get('/home',(req,res)=>{
 res.send("HOME")
})

export{app}