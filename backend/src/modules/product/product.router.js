import {Router} from "express";
import {upload} from "../../middleware/multer.middleware.js";
import { addProduct } from "./product.controller.js";


const productRouter = Router();

productRouter.route('/add').post(upload.array('images',5),addProduct);



export {productRouter};