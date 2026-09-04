import { Router } from "express";
import {
    deactivateSeller,
    getSeller,
    registerSeller,
    updateSeller,
} from "./seller.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { verifyAccessToken } from "../../utils/token/jwtverification.js";

const sellerRouter = Router();

sellerRouter
    .route("/register")
    .post(
        verifyAccessToken,
        upload.fields[
            ({ name: "logo", maxCount: 1 }, { name: "coverPage", maxCount: 1 })
        ],
        registerSeller,
    );
sellerRouter
    .route("/updates/:sellerId")
    .patch(
        verifyAccessToken,
        upload.fields[
            ({ name: "logo", maxCount: 1 }, { name: "coverPage", maxCount: 1 })
        ],
        updateSeller,
    );

sellerRouter.route("/getSeller/:sellerId").get(verifyAccessToken, getSeller);

sellerRouter
    .route("/deactivate/:sellerId")
    .patch(verifyAccessToken, deactivateSeller);

export { sellerRouter };
