const joi = require("joi")


const userValidationSchema = joi.object({

    name: joi.string().required().min(3).max(30).messages({
        'string.min': 'Username must be at least {#limit} characters long.',
        'string.max': 'Username cannot be more than {#limit} characters long.',
        'string.empty': 'Username is required.',
        'any.required': 'Username is a required field.'

    }),
    email: joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'please use a valid email',
        'string.empty': 'please Email is required',
        'string.any': 'please Email is a required field',
    }),
    password: joi.string().min(8).required().messages({
        'string.password': 'please use a valid password',
        'string.empty': 'password is required please',
        'string.min': 'please minimum of 8 characters',
        'string.any': 'please password is a required field'
    })
});
const loginValidationSchema = joi.object({
    email: joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'please use a valid email',
        'string.empty': 'please Email is required',
        'string.any': 'please Email is a required field',
    }),
    password: joi.string().required().messages({
        'string.password': 'please use a valid password',
        'string.empty': 'password is required please',
        'string.any': 'please password is a required field'
    })
})
const ValidateUser = (data) => {
    const { error, value } = userValidationSchema.validate(data)
    if (error) {
        const errorDetails = error.details.map((detail) => {
            return {
                field: detail.path[0],
                message: detail.message
            }
        });
        return {
            error: {
                code: "VALIDATION_ERROR",
                message: "validation_failed",
                detail: errorDetails

            }
        }
    }
    return { value }
}

const ValidateLogin = (data) => {
    const { error, value } = loginValidationSchema.validate(data)
    if (error) {
        const errorDetails = error.details.map((detail) => {
            return {
                field: detail.path[0],
                message: detail.message
            }
        });
        return {
            error: {
                code: "VALIDATION_ERROR",
                messages: "validation_failed",
                details: errorDetails
            }
        }
    }
    return { value }
}


module.exports = { ValidateUser, ValidateLogin }