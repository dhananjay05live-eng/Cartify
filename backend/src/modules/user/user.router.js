import {Router} from "express";
import { registerUser,loginUser,logoutUser } from "./user.controller.js";
import {verifyRefreshToken} from "../../utils/token/jwtverification.js"

const userRouter = Router();


//user routes unsecured
userRouter.route('/register').post(registerUser)

// user routes secured
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyRefreshToken,logoutUser)

export {userRouter}