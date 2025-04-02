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
    set({ isExpenseSubmitting: true });
    try {
      const res = await axiosInstance.post("/expense", expenseData);
      set((state) => ({ 
        expenses: [...state.expenses, res.data],
        isExpenseSubmitting: false 
      }));
      toast.success("Expense added successfully");
      return res.data;
    } catch (error) {
      set({ isExpenseSubmitting: false });
      toast.error(error.response?.data?.message || "Failed to add expense");
      throw error;
    }
  },

  // Update Expense
  updateExpense: async (id, updatedExpense) => {
    set({ isExpenseSubmitting: true });
    try {
      const res = await axiosInstance.put(`/expense/${id}`, updatedExpense);
      set((state) => ({
        expenses: state.expenses.map((exp) => 
          exp._id === id ? res.data : exp
        ),
        isExpenseSubmitting: false
      }));
      toast.success("Expense updated successfully");
      return res.data;
    } catch (error) {
      set({ isExpenseSubmitting: false });
      toast.error(error.response?.data?.message || "Failed to update expense");
      throw error;
    }
  },

  // Delete Expense
  deleteExpense: async (id) => {
    set({ isExpenseSubmitting: true });
    try {
      await axiosInstance.delete(`/expense/${id}`);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp._id !== id),
        selectedExpense: state.selectedExpense?._id === id ? null : state.selectedExpense
      }));
      toast.success("Expense deleted successfully");
    } catch (error) {
      set({ isExpenseSubmitting: false });
      toast.error(error.response?.data?.message || "Failed to delete expense");
      throw error;
    }
  },

  // Set Selected Expense
  setSelectedExpense: (expense) => set({ selectedExpense: expense }),

  // Clear Selected Expense
  clearSelectedExpense: () => set({ selectedExpense: null }),

  // Clear Errors
  clearError: () => set({ error: null })
}));
