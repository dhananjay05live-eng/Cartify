import mongoose from "mongoose";
import { Seller } from "./seller.model.js";
import { uploadImageOnCloudinary } from "../../utils/cloud_storage/cloudinary.js";

const registerSeller = async (req, res) => {
    try {
        const userId = req.user._id;

        const { storeName, description } = req.body;

        // Check if user is already a seller
        const existingSeller = await Seller.findOne({ userId });

        if (existingSeller) {
            return res.status(409).json({
                message: "user is already a seller",
            });
        }

        // Check required files
        if (!req.files?.logo?.[0] || !req.files?.coverPage?.[0]) {
            return res.status(400).json({
                message: "logo and cover page are required",
            });
        }

        const logo = req.files.logo[0];
        const coverPage = req.files.coverPage[0];

        // Upload both simultaneously
        const [uploadedLogo, uploadedCoverPage] = await Promise.all([
            uploadImageOnCloudinary(logo.path),
            uploadImageOnCloudinary(coverPage.path),
        ]);

        if (!uploadedLogo || !uploadedCoverPage) {
            return res.status(500).json({
                message: "upload on cloudinary failed",
            });
        }

        // Create seller
        const seller = await Seller.create({
            storeName,
            userId,
            description,
            logo: uploadedLogo,
            coverPage: uploadedCoverPage,
        });

        return res.status(201).json({
            message: "seller created successfully",
            seller: {
                id: seller._id,
                storeName: seller.storeName,
                description: seller.description,
                status: seller.status,
                logo: seller.logo,
                coverPage: seller.coverPage,
            },
        });
    } catch (error) {
        console.error("SELLER REGISTRATION ERROR:", error);

        return res.status(500).json({
            message: "seller registration failed",
            error: error.message,
        });
    }
};

const updateSeller = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.sellerId)) {
            return res.status(400).json({
                message: "invalid id",
            });
        }
        const allowedFields = ["storeName", "description"];

        const updateData = {};

        // Normal fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        // Files
        if (req.files?.logo?.[0]) {
            const uploadedLogo = await uploadImageOnCloudinary(
                req.files.logo[0].path,
            );

            updateData.logo = uploadedLogo;
        }

        if (req.files?.coverPage?.[0]) {
            const uploadedCoverPage = await uploadImageOnCloudinary(
                req.files.coverPage[0].path,
            );

            updateData.coverPage = uploadedCoverPage;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "nothing to update",
            });
        }

        const seller = await Seller.findOneAndUpdate(
            {
                _id: req.params.sellerId,
                userId: req.user._id,
            },
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            },
        );

        return res.status(200).json({
            message: "seller updated successfully",
            seller,
        });
    } catch (error) {
        return res.status(500).json({
            message: "seller update failed",
        });
    }
};

const getSeller = async (req, res) => {
    try {
        const userId = req.user._id;
        const sellerId = req.params.sellerId;

        if (!mongoose.isValidObjectId(sellerId)) {
            return res.status(400).json({
                message: "invalid id",
            });
        }

        if (!sellerId) {
            return res.status(400).json({ message: "seller not found" });
        }

        const seller = await Seller.findOne({ _id: sellerId, userId: userId });

        return res
            .status(200)
            .json({ message: "seller found successfully", seller: seller });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "something went wrong while fetching seller" });
    }
};

const deactivateSeller = async (req, res) => {
    try {
        const userId = req.user._id;
        const sellerId = req.params.sellerId;

        if (!mongoose.isValidObjectId(sellerId)) {
            return res.status(400).json({
                message: "invalid id",
            });
        }

        if (!sellerId) {
            return res.status(404).json({ message: "seller not found" });
        }

        const seller = await Seller.findOneAndUpdate(
            {
                _id: sellerId,
                userId: userId,
                status: "active",
            },
            {
                $set: { status: "inactive" },
            },
            {
                new: true,
            },
        );

        if (!seller) {
            return res.status(404).json({ message: "seller not found" });
        }

        return res.status(200).json({
            message: "seller status updated",
            storeName: seller.storeName,
            status: seller.status,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "seller status update failed!" });
    }
};

export { registerSeller, updateSeller, getSeller, deactivateSeller };
