import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";


import connectDB from "./config/db.config.js";
import userRoutes from "./routes/user.routes.js"
import videoRoutes from "./routes/video.routes.js"
import { auth } from "./middlewares/auth.middleware.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/video", auth, videoRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

