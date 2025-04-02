// store/useExpenseStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  selectedExpense: null,
  isExpensesLoading: false,
  isExpenseSubmitting: false,
  error: null,

  // Fetch Expenses
  getExpenses: async (groupId) => {
    set({ isExpensesLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/expense${groupId ? `?groupId=${groupId}` : ''}`);
      set({ expenses: res.data, isExpensesLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch expenses";
      set({ 
        error: errorMessage,
        isExpensesLoading: false 
      });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Add Expense
  addExpense: async (expenseData) => {
    try {
      const res = await axiosInstance.post("/expense", expenseData); // Ensure correct data format
      set((state) => ({ expenses: [...state.expenses, res.data.expense] })); // Use `res.data.expense`
      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Error in addExpense:", error);
      toast.error("Failed to add expense");
      throw new Error("Failed to add expense");
    }
  },

  // Update Expense
  updateExpense: async (id, updatedExpense) => {
    set({ isExpenseSubmitting: true, error: null });
    try {
      const res = await axiosInstance.put(`/expense/${id}`, updatedExpense);
      set((state) => ({
        expenses: state.expenses.map((exp) => (exp._id === id ? res.data : exp)),
        isExpenseSubmitting: false
      }));
      toast.success("Expense updated successfully");
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update expense";
      set({ 
        error: errorMessage,
        isExpenseSubmitting: false
      });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Delete Expense
  deleteExpense: async (id) => {
    try {
      await axiosInstance.delete(`/expense/${id}`);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp._id !== id)
      }));
      toast.success("Expense deleted successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete expense";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Set Selected Expense
  setSelectedExpense: (expense) => set({ selectedExpense: expense }),

  // Clear Selected Expense
  clearSelectedExpense: () => set({ selectedExpense: null }),

  // Clear Errors
  clearError: () => set({ error: null })
}));
