import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

export { imageSchema };
