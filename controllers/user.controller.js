const { ValidateUser, ValidateLogin } = require("../validators/user-validator")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const bcrypt = require("bcrypt")


const registerUser = async (req, res) => {
    try {
        const result = ValidateUser(req.body);
        if (result.error) {
            return res.status(400).json({
                success: false,
                error: result.error,
            });
        }
        const user = new User(req.body)
        await user.save()
        return res.status(201).json({
            success: true,
            message: "User Successfully created",
            data: user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Bad Request",
            error: {
                code: "BAD_REQUEST",
                details: error.message
            }
        })
    }
}
const accessProfile = async (req, res) => {
    try {
        const result = ValidateLogin(req.body)
        if (result.error) {
            return res.status(400).json({
                success: false,
                error: result.error
            })
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Email address",
                error: {
                    code: "INVALID_EMAIL_OR_EMAIL_DOESNOT_EXIST",
                    details: "Email not valid"
                }
            })
        }


        const isvalidPassword = await bcrypt.compare(req.body.password, user.password)
        if (!isvalidPassword) {
            return res.status(400).json({
                success: false,
                message: "password incorrect",
                error: {
                    code: "PASSWORD_INCORRECT_OR_INVALID",
                    details: "INVALID PASSWORD"
                }
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "4h" })
        return res.status(200).json({
            success: true,
            message: "Suceessfully logged in Here is Your Log Token",
            data: {
                token
            }
        })


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "internal server error",
            error: {
                code: "INTERNAL_SEVER_ERROR",
                details: error.message
            }
        })
    }
}
const getUser = async (req, res) => {
    try {
        const user = await User.find()
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
                error: {
                    code: "User Not Found",
                    details: error.message
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Successfully Fetched",
            data: {
                user
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: {
                code: "INTERNAL_SERVER_ERROR",
                details: error.message
            }
        })
    }
}
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "UserId Not Found or Incorrect",
                error: {
                    code: "UserId Not Found or Incorrect please Check again",
                    details: error.message
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Successfully Fetched",
            data: {
                user
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: {
                code: "INTERNAL_SERVER_ERROR",
                details: error.message
            }
        })
    }
}
module.exports = {
    registerUser,
    accessProfile,
    getUser,
    getUserById
}