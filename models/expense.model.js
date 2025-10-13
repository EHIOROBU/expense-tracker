const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: [true, "category is required please"]
    },
    amount: {
        type: Number,
        required: [true, "amount is required"]

    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
});
const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense 