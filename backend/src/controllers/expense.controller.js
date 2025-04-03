import Expense from "../models/expense.model.js";
import Group from "../models/group.model.js";
import Trip from "../models/trip.model.js";

// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description, groupId, sharedWith, date, tripId } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !groupId || !date) {
      return res.status(400).json({
        message: "Title, amount, category, date, and group ID are required",
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // Check if group exists and user is a member
    const group = await Group.findOne({
      _id: groupId,
      members: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found or you're not a member",
      });
    }

    const newExpense = new Expense({
      title,
      amount,
      category,
      description,
      groupId,
      sharedWith: sharedWith || [],
      date: date || Date.now(), // Use provided date or default to now
      tripId,
    });

    await newExpense.save();

    const populatedExpense = await Expense.findById(newExpense._id).populate(
      "groupId",
      "name"
    );

    if (newExpense.tripId) {
      const trip = await Trip.findById(newExpense.tripId);
      if (trip?.chatGroupId) {
        // Notify the chat group about the new expense
        await Group.findByIdAndUpdate(trip.chatGroupId, {
          $push: { messages: { text: `New expense added: ${title} - $${amount}`, sender: req.user._id } }
        });
      }
    }

    res.status(201).json({
      message: "Expense created successfully",
      expense: populatedExpense,
    });
  } catch (error) {
    console.error("Error in createExpense:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all expenses for a user
export const getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { groupId } = req.query;

    // Build query based on user's access
    let query = {
      $or: [
        { userId }, // User's own expenses
        { "sharedWith.userId": userId } // Expenses shared with user
      ]
    };

    if (groupId) {
      query.groupId = groupId;
    }

    const expenses = await Expense.find(query)
      .populate("userId", "username profilePic")
      .populate("groupId", "name")
      .populate("sharedWith.userId", "username profilePic")
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error in getExpenses:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// Get a specific expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("userId", "username profilePic")
      .populate("groupId", "name")
      .populate("sharedWith.userId", "username profilePic");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if user is the expense creator or a group member
    const isCreator = expense.userId.toString() === req.user._id.toString();
    const isGroupMember = expense.sharedWith.some(
      share => share.userId._id.toString() === req.user._id.toString()
    );

    if (!isCreator && !isGroupMember) {
      return res.status(403).json({ 
        message: "Not authorized to view this expense" 
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Error in getExpenseById:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// Update an existing expense
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description, sharedWith } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if user is the expense creator
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Not authorized to update this expense" 
      });
    }

    // Validate amount if provided
    if (amount && amount <= 0) {
      return res.status(400).json({ 
        message: "Amount must be greater than 0" 
      });
    }

    // Validate sharedWith amounts if provided
    if (sharedWith && sharedWith.length > 0) {
      const totalSharedAmount = sharedWith.reduce((sum, share) => sum + share.amount, 0);
      if (totalSharedAmount > (amount || expense.amount)) {
        return res.status(400).json({ 
          message: "Total shared amount cannot exceed the expense amount" 
        });
      }
    }

    // Update fields
    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description || expense.description;
    if (sharedWith) {
      expense.sharedWith = sharedWith;
    }

    await expense.save();

    // Populate the updated expense
    const updatedExpense = await Expense.findById(expense._id)
      .populate("userId", "username profilePic")
      .populate("groupId", "name")
      .populate("sharedWith.userId", "username profilePic");

    res.status(200).json({ 
      message: "Expense updated successfully", 
      expense: updatedExpense 
    });
  } catch (error) {
    console.error("Error in updateExpense:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if user is the expense creator
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Not authorized to delete this expense" 
      });
    }

    await expense.deleteOne();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error in deleteExpense:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// Split an expense
export const splitExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { sharedWith } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const totalSharedAmount = sharedWith.reduce((sum, share) => sum + share.amount, 0);
    if (totalSharedAmount > expense.amount) {
      return res.status(400).json({ message: "Shared amount exceeds total expense" });
    }

    expense.sharedWith = sharedWith;
    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to split expense", error: error.message });
  }
};
