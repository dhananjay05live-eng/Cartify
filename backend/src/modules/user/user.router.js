import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    UpdateProfilePicture,
} from "./user.controller.js";
import {
    verifyAccessToken,
    verifyRefreshToken,
} from "../../utils/token/jwtverification.js";
import { upload } from "../../middleware/multer.middleware.js";

const userRouter = Router();

//user routes unsecured
userRouter.route("/register").post(registerUser);

// user routes secured
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyRefreshToken, logoutUser);

userRouter
    .route("updatePf")
    .patch(
        verifyAccessToken,
        upload.fields([{ name: "Profile", maxCount: 1 }]),
        UpdateProfilePicture,
    );

export { userRouter };
