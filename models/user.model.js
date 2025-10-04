const mongoose = require("mongoose")
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "please username is required"]
    },

    email: {
        type: String,
        required: [true, "email is required please use one"],
        unique: [true, "email already existed"],
        validator: [(value) => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(value);
        }, "use a valid email please"]
    },
    password: {
        type: String,
        required: [true, "please password is required"],
        minlength: [8, "please use minimum password length of 89 characters"]
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema)
module.exports = User