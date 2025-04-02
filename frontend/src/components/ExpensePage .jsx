import { useEffect, useState } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import { useGroupStore } from "../store/useGroupStore";
import ExpenseSkeleton from "./skeletons/ExpenseSkeleton";
import { ReceiptText, Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const ExpensePage = () => {
  const { selectedGroup } = useGroupStore();
  const { 
    getExpenses, 
    expenses, 
    isExpensesLoading,
    addExpense,
    deleteExpense,
    isExpenseSubmitting 
  } = useExpenseStore();

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Other",
    description: "",
    sharedWith: [],
    date: new Date().toISOString().split("T")[0], // Add default date
  });

  useEffect(() => {
    if (selectedGroup?._id) {
      getExpenses(selectedGroup._id);
    }
  }, [selectedGroup?._id, getExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) {
      toast.error("Title and amount are required");
      return;
    }

    try {
      console.log("Submitting expense:", newExpense); // Log the expense data
      await addExpense({
        ...newExpense,
        groupId: selectedGroup._id,
        amount: parseFloat(newExpense.amount),
      });
      setShowAddExpense(false);
      setNewExpense({
        title: "",
        amount: "",
        category: "Other",
        description: "",
        sharedWith: [],
        date: new Date().toISOString().split("T")[0], // Reset date
      });
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  if (isExpensesLoading) return <ExpenseSkeleton />;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="size-6" />
            <h2 className="text-lg font-semibold">Expenses</h2>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
            className="btn btn-primary btn-sm gap-2"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddExpense && (
        <div className="p-4 border-b border-base-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                placeholder="Expense title"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <option value="Accommodation">Accommodation</option>
                <option value="Transportation">Transportation</option>
                <option value="Food">Food</option>
                <option value="Activities">Activities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Add a description..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isExpenseSubmitting}
              >
                {isExpenseSubmitting ? "Adding..." : "Add Expense"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAddExpense(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="card bg-base-200 shadow-sm"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{expense.title}</h3>
                    <p className="text-sm text-base-content/70">{expense.category}</p>
                    {expense.description && (
                      <p className="text-sm mt-2">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-semibold">${expense.amount.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="btn btn-ghost btn-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="text-center text-base-content/70 py-8">
              No expenses found. Add one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
