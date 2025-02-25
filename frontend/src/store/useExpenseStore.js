// store/useExpenseStore.js
import { create } from "zustand";

export const useExpenseStore = create((set) => ({
  expenses: [],
  loading: false,
  error: null,

  // Fetch Expenses
  getExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/expenses"); // Ensure this endpoint is correct
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      set({ expenses: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add Expense
  addExpense: async (expense) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error("Failed to add expense");
      const newExpense = await response.json();
      set((state) => ({ expenses: [newExpense, ...state.expenses] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Update Expense
  updateExpense: async (id, updatedExpense) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense),
      });
      if (!response.ok) throw new Error("Failed to update expense");
      const updated = await response.json();
      set((state) => ({
        expenses: state.expenses.map((exp) => (exp._id === id ? updated : exp)),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Delete Expense
  deleteExpense: async (id) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete expense");
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp._id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Clear Errors
  clearError: () => set({ error: null }),
}));
