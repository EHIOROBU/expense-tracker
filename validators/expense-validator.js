const joi = require("joi")

const expenseValidationSchema = joi.object({
userId: joi.string().required().messages({
        'string.userId':'please use a valid userId',
        'string.empty':'please userId is required',
         'string.any':'please userId is required field',
    }),
     date: joi.date().required().messages({
        'date.base':'Date Must be required',
       'any.required': 'Date is required',
    }),
    category: joi.string().required().messages({
        'string.category':'please use a valid category',
        'string.empty':'please category is required',
         'string.any':'please category is required field',
    }),
    amount: joi.number().required().messages({
        'number.base':'Amount Must be number',
         'any.required': 'Amount is required',
    }),
      description: joi.string().required().messages({
        'string.description':'please use a valid description',
        'string.empty':'please description is required',
         'string.any':'please description is required field',
    })
})
 const ValidateExpense = (data) =>{
    const {error, value} = expenseValidationSchema.validate(data)
    if(error){
        const errorDetails = error.details.map((detail)=>{
            return{
                field: detail.path[0],
                message: detail.message 
            }
        })
        return {
            error:{
                code:"VALIDATION_ERROR",
                message: "validation failed",
                details: errorDetails
            }
        }
    }
    return {value}
 } 

 module.exports = ValidateExpense