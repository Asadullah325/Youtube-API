import expess from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/use.model.js";
import cloudinary from "../config/cloudinary.js";

const router = expess.Router();

router.post("/register", async (req, res) => {
    try {
        const { channelName, email, phone, password } = req.body;

        const hashcode = await bcrypt.hash(password, 10);

        const fileUpload = await cloudinary.uploader.upload(
            req.files.imageUrl.tempFilePath
        );

        const newuser = new User({
            _id: new mongoose.Types.ObjectId(),
            channelName,
            email,
            phone,
            password: hashcode,
            imageUrl: fileUpload.secure_url,
            logoID: fileUpload.public_id,
        });

        const user = await newuser.save();
        res.status(201).json("created", user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
            message: "something went wrong"
        })
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "invalid credentials"
            });
        }

        const token = jwt.sign({
            id: user._id,
            channelName: user.channelName,
            email: user.email,
            phone: user.phone,
            logoID: user.logoID
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            message: "login successful",
            token,
            user
        });

        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
            message: "something went wrong"
        })
    }
});


export default router;