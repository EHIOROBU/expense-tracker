const Expense = require("../models/expense.model")
const ValidateExpense = require("../validators/expense-validator")


const createExpense = async (req, res) => {
    try {
        const result = ValidateExpense(req.body)
        if (result.error) {
            return res.status(400).json({
                success: false,
                error: result.error
            })
        }

        const expense = new Expense({
            userId: req.user._id,
            date: req.body.date,
            category: req.body.category,
            amount: req.body.amount,
            description: req.body.description
        })

        await expense.save()
        return res.status(201).json({
            success: true,
            message: "Expense Successfully Created",
            data: expense
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: {
                code: "INTERNAL_SEVER_ERROR",
                details: error.message
            }
        })
    }
}

const getExpenses = async (req, res) => {
    try {
        const filter = req.query.filter;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        const userId = req.user._id;

        let query = { userId };
        const today = new Date();

        switch (filter) {
            case "today":
                query.date = {
                    $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0),
                    $lte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
                };
                break;
            case "thisWeek":
                const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
                query.date = { $gte: firstDayOfWeek, $lte: lastDayOfWeek };
                break;
            case "lastWeek":
                const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                const lastWeekFirstDay = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay());
                const lastWeekLastDay = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() + (6 - lastWeek.getDay()));
                query.date = { $gte: lastWeekFirstDay, $lte: lastWeekLastDay };
                break;
            case "thisMonth":
                query.date = {
                    $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                    $lte: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)
                };
                break;
            case "last3Months":
                const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
                query.date = { $gte: threeMonthsAgo, $lte: today };
                break;
            case "thisYear":
                query.date = {
                    $gte: new Date(today.getFullYear(), 0, 1),
                    $lte: new Date(today.getFullYear(), 11, 31, 23, 59, 59)
                };
                break;
            case "custom":
                if (!startDate || !endDate) {
                    return res.status(400).json({
                        success: false,
                        message: 'Start date and end date are required for custom filter',
                    });
                }
                query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid filter',
                });
        }

        const expenses = await Expense.find(query);
        return res.status(200).json({
            success: true,
            message: "Expenses successfully fetched",
            data: expenses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message,
            },
        });
    }
};
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expenseUpdate = await Expense.findByIdAndUpdate(id, req.body)
        if (!expenseUpdate) {
            return res.status(404).json({
                success: false,
                message: "Expense Not Found Or You Do Not Have Permission To Update",
                error: {
                    code: "UNAVAILABLE_OR_NO_PERMISSION",
                    details: "Expense Not found Or No Permission"
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: "Expense Succesfully Updated"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server Error",
            error: {
                code: "INTERNAL_SERVER_ERROR",
                details: "Internal server Error"
            }
        })
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expenseDelete = await Expense.findByIdAndDelete(id)
        if (!expenseDelete) {
            return res.status(404).json({
                success: false,
                message: "Expense Not Found Or You Do Not Have Permission To Delete",
                error: {
                    code: "UNAVAILABLE_OR_NO_PERMISSION",
                    details: "Expense Not found Or No Permission"
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: "Expense Successfully Delete From Database"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: {
                code: "INTERNAL SERVER ERROR",
                details: "Internal server Error"
            }
        })
    }
}
const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params
        const expense = await Expense.findById(id)
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "expense ID Not Found or Incorrect",
                error: {
                    code: "expense ID Not Found or Incorrect please Check again",
                    details: error.message
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Successfully Fetched",
            data: {
                expense
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
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpenseById
}