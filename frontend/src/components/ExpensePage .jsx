import { useEffect, useState } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import ExpenseSkeleton from "../components/skeletons/ExpenseSkeleton";
import { ReceiptText } from "lucide-react";

const ExpenseSidebar = () => {
  const { getExpenses, expenses, isExpensesLoading } = useExpenseStore();
  const [showLargeExpenses, setShowLargeExpenses] = useState(false);

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  // Filter expenses greater than $1000
  const filteredExpenses = showLargeExpenses
    ? expenses.filter((expense) => expense.amount > 1000)
    : expenses;

  if (isExpensesLoading) return <ExpenseSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <ReceiptText className="size-6" />
          <span className="font-medium hidden lg:block">Expenses</span>
        </div>

        {/* Filter Toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showLargeExpenses}
              onChange={(e) => setShowLargeExpenses(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show > $1000</span>
          </label>
          <span className="text-xs text-zinc-500">({filteredExpenses.length} items)</span>
        </div>
      </div>

      {/* Expense List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
          >
            {/* Expense Icon */}
            <div className="relative mx-auto lg:mx-0">
              <div className="size-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                💰
              </div>
            </div>

            {/* Expense Info */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{expense.title}</div>
              <div className="text-sm text-zinc-400">${expense.amount}</div>
            </div>
          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No expenses found</div>
        )}
      </div>
    </aside>
  );
};

export default ExpenseSidebar;
