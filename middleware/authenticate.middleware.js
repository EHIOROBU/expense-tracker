const jwt = require("jsonwebtoken")
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "PLEASE AUTHENTICATE",
            error: {
                code: "Authentication Error",
                details: "PLEASE AUTHENTICATE",
            }
        });
    }
};
module.exports = authenticate;