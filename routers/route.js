const express = require("express")
const router = express.Router()
const authenticate = require("../middleware/authenticate.middleware")

const { registerUser, accessProfile, getUser, getUserById } = require("../controllers/user.controller")
const { createExpense, getExpenses, updateExpense, deleteExpense, getExpenseById } = require("../controllers/expense.controller")

router.post("/v1/auth/register", registerUser)
router.post("/v1/auth/profile", accessProfile)
router.get("/v1/users", authenticate, getUser)
router.get("/v1/users/:id", authenticate, getUserById)

//expense endpoint
router.post("/v1/expenses", authenticate, createExpense)
router.get("/v1/expenses", authenticate, getExpenses)
router.patch("/v1/expenses/:id", authenticate, updateExpense)
router.delete("/v1/expenses/:id", authenticate, deleteExpense)
router.get("/v1/expenses/:id", authenticate, getExpenseById)

module.exports = router