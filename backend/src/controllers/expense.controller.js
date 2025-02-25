import Expense from "../models/expense.model.js";

// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      user: req.user._id, // Assuming user info is from the protect middleware
      title,
      amount,
      category,
      date,
      description,
    });

    await newExpense.save();

    res.status(201).json({
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error in createExpense:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all expenses for a user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error in getExpenses:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Error in getExpenseById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update an existing expense
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description || expense.description;

    await expense.save();

    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Error in updateExpense:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error in deleteExpense:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
