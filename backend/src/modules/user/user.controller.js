import { User } from "./user.model.js";
import {
    generateAccessTokens,
    generateRefreshTokens,
} from "../../utils/token/jwtgeneration.js";

import {
    uploadImageOnCloudinary,
    deleteImageOnCloudinary,
} from "../../utils/cloud_storage/cloudinary.js";
import { error } from "console";

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json({ message: "user already exists" });
        }

        const user = await User.create({ name, email, password, phone });

        return res.status(201).json({
            message: "user creation successful",
            user: { name: user.name, email: user.email, id: user._id },
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went bad while user creation",
            error: error,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "invalid credentials",
            });
        }

        if (!(await user.isPasswordCorrect(password))) {
            return res.status(401).json({
                message: "invalid credentials",
            });
        }

        const accessToken = generateAccessTokens(user);
        const refreshToken = generateRefreshTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .json({
                message: "login successful",
            });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "login procedure failed internally",
            error: error.message,
        });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.files?.profile?.[0]) {
            return res.status(400).json({
                message: "profile picture is required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        const oldProfilePicture = user.profilePicture?.publicId;
        const profilePicture = req.files.profile[0];

        const uploadedProfilePicture = await uploadImageOnCloudinary(
            profilePicture.path,
        );

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    profilePicture: uploadedProfilePicture,
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        if (oldProfilePicture) {
            await deleteImageOnCloudinary(oldProfilePicture);
        }

        return res.status(200).json({
            message: "profile picture updated successfully",
            profilePicture: updatedUser.profilePicture,
        });
    } catch (error) {
        console.error("PROFILE PICTURE UPDATE ERROR:", error);

        return res.status(500).json({
            message: "profile picture update failed",
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({ message: "unauthorized request" });
        }
        const logout = await User.findByIdAndUpdate(
            userId,
            { refreshToken: null },
            { returnDocument: "after" },
        );
        if (logout === null) {
            return res.status(500).json({ message: "logout failed" });
        }
        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({ message: `logout successful for user ${logout.name}` });
    } catch (error) {
        return res.status(500).json({ message: "failed logout", error: error });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "user does not exist",
            });
        }

        const availableFields = ["name", "email", "phone"];
        const updates = {};

        for (const field of availableFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "no data to update",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        return res.status(200).json({
            message: "data updation successful",
        });
    } catch (error) {
        console.error("USER UPDATE ERROR:", error);

        return res.status(500).json({
            message: "something went wrong while updating the data",
        });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    updateProfilePicture,
    updateUser,
};
