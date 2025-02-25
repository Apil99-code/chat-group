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


router.get("/", protectRoute, getExpenses);

router.get("/:id", protectRoute, getExpenseById);

router.post("/", protectRoute, createExpense);

router.put("/:id", protectRoute, updateExpense);

router.delete("/:id", protectRoute, deleteExpense);

export default router;
