import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Create a new expense
router.post("/", createExpense);

// Get all expenses for a user
router.get("/", getExpenses);

// Get a specific expense by ID
router.get("/:id", getExpenseById);

// Update an expense
router.put("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

export default router;
