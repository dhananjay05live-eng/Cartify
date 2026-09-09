import { Product } from "./product.model.js";
import { uploadImageOnCloudinary } from "../../utils/cloud_storage/cloudinary.js";

const addProduct = async (req, res) => {
    const { name, description, price, discountedPrice, stock, isActive } =
        req.body;

    const requestimages = req.files;
    let images = [];

    try {
        if (requestimages && requestimages.length > 0) {
            const uploadedPromises = requestimages.map((image) =>
                uploadImageOnCloudinary(image.path),
            );

            images = await Promise.all(uploadedPromises);
        }

        if (images.length === 0) {
            return res.status(500).json({
                message: "product images upload failed",
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            discountedPrice,
            stock,
            images,
            isActive,
        });

        return res.status(201).json({
            message: "product created successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            message: "product failed to upload",
            error,
        });
    }
};

const deListProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).json({ message: "require id" });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: productId,
                isActive: true,
            },
            {
                $set: { isActive: false },
            },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found or already delisted",
            });
        }

        return res.status(200).json({
            message: "Product delisted",
            isActive: updatedProduct.isActive,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Product delisting failed!",
            error: error.message,
        });
    }
};

export { addProduct };
