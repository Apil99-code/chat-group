import { useState, useEffect } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useGroupStore } from '../store/useGroupStore';
import { useTripStore } from '../store/useTripStore';
import ManageExpenses from '../components/ManageExpenses';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { BarChart, ListChecks } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ExpensePage = () => {
  const { expenses, getExpenses } = useExpenseStore();
  const { selectedGroup } = useGroupStore();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'stats'
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    categoryData: {
      labels: [],
      datasets: []
    },
    timeData: {
      labels: [],
      datasets: []
    },
    groupData: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    if (selectedGroup?._id && activeTab === 'stats') {
      updateChartData();
    }
  }, [expenses, dateRange, selectedYear, selectedGroup, activeTab]);

  const filterExpensesByDateRange = (expenses) => {
    const now = new Date();
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (dateRange === 'weekly') {
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return isWithinInterval(expenseDate, { start: weekStart, end: weekEnd });
      }
      return isWithinInterval(expenseDate, { start: yearStart, end: yearEnd });
    });
  };

  const updateChartData = () => {
    const filteredExpenses = filterExpensesByDateRange(expenses);

    // Category breakdown
    const categoryTotals = {};
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    setChartData(prev => ({
      ...prev,
      categoryData: {
        labels: Object.keys(categoryTotals),
        datasets: [{
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      }
    }));

    // Time-based data
    const timeLabels = dateRange === 'weekly' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const timeData = new Array(timeLabels.length).fill(0);
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const index = dateRange === 'weekly' 
        ? date.getDay() - 1 
        : date.getMonth();
      if (index >= 0 && index < timeData.length) {
        timeData[index] += expense.amount;
      }
    });

    setChartData(prev => ({
      ...prev,
      timeData: {
        labels: timeLabels,
        datasets: [{
          label: 'Expenses',
          data: timeData,
          backgroundColor: '#36A2EB'
        }]
      }
    }));

    // Group vs Personal expenses
    const groupTotal = filteredExpenses
      .filter(expense => expense.isGroupExpense)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const personalTotal = filteredExpenses
      .filter(expense => !expense.isGroupExpense)
      .reduce((sum, expense) => sum + expense.amount, 0);

    setChartData(prev => ({
      ...prev,
      groupData: {
        labels: ['Group Expenses', 'Personal Expenses'],
        datasets: [{
          data: [groupTotal, personalTotal],
          backgroundColor: ['#FF6384', '#36A2EB']
        }]
      }
    }));
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `$${value.toFixed(2)}`;
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="tabs tabs-boxed">
          <button
            className={`tab gap-2 ${activeTab === 'manage' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            <ListChecks className="w-4 h-4" />
            Manage Expenses
          </button>
          <button
            className={`tab gap-2 ${activeTab === 'stats' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart className="w-4 h-4" />
            Statistics
          </button>
        </div>
      </div>

      {activeTab === 'manage' ? (
        <ManageExpenses />
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="select select-bordered"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="select select-bordered"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="text-xl font-bold mb-4">Expense Categories</h2>
                <div className="h-[300px]">
                  <Pie data={chartData.categoryData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Time-based Trends */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="text-xl font-bold mb-4">
                  {dateRange === 'weekly' ? 'Weekly' : 'Monthly'} Expenses
                </h2>
                <div className="h-[300px]">
                  <Bar data={chartData.timeData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Group vs Personal */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="text-xl font-bold mb-4">Group vs Personal Expenses</h2>
                <div className="h-[300px]">
                  <Pie data={chartData.groupData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensePage; 