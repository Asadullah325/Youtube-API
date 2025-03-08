import expess from "express";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import cloudinary from "../config/cloudinary.js";

const router = expess.Router();

router.post("/upload", async (req, res) => {
    try {
        const { title, description, category, tags } = req.body;

        if (!req.files.videoUrl || !req.files.thumbnailUrl) {
            return res.status(400).json({
                message: "videoUrl and thumbnailUrl are required"
            });
        }

        const videoUpload = await cloudinary.uploader.upload(
            req.files.videoUrl.tempFilePath,
            {
                resource_type: "video",
                folder: "videos"
            }
        );
        const thumbnailUpload = await cloudinary.uploader.upload(
            req.files.thumbnailUrl.tempFilePath,
            {
                folder: "thumbnails"
            }
        );

        const newVideo = new Video({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            category,
            tags: tags ? tags.split(",") : [],
            videoUrl: videoUpload.secure_url,
            thumbnailUrl: thumbnailUpload.secure_url,
            thumbnailId: thumbnailUpload.public_id,
            videoId: videoUpload.public_id,
            user_id: req.user.id
        });

        const video = await newVideo.save();

        res.status(200).json({
            message: "video uploaded successfully",
            video
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
            message: "something went wrong"
        })
    }
})


export default router