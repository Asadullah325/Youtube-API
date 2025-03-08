import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

        if (!token) {
            return res.status(400).json({
                message: "token not found"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
            message: "something went wrong"
        })
    }
}