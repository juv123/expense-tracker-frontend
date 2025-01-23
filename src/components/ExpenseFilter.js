import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EXPENSE_BETWEEN_DATES_API } from '../config/constants';
import axios from 'axios';

const ExpenseFilter = () => {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '' });

  // Function to fetch expenses based on date filters
  const fetchExpensesByFilter = async () => {
    try {
      const response = await axios.get(EXPENSE_BETWEEN_DATES_API, {
        params: { from: filters.from, to: filters.to },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Fetch all expenses when filters are empty
  useEffect(() => {
    fetchExpensesByFilter();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-gray-800 text-lg font-semibold">Expenses</h4>
          <ul>
            <li>
              <Link
                to="/AddExpense"
                className="block py-3 px-4 mb-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Add Expense
              </Link>
            </li>
          </ul>
        </div>

        {/* Date Filter Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-gray-700 font-semibold" htmlFor="from">
                From
              </label>
              <input
                type="date"
                id="from"
                name="from"
                value={filters.from}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold" htmlFor="to">
                To
              </label>
              <input
                type="date"
                id="to"
                name="to"
                value={filters.to}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto p-6 m-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Category Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {expenses.map((expense, index) => (
              <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{expense.category.category_name}</td>
                <td className="py-3 px-6 text-left">{expense.description}</td>
                <td className="py-3 px-6 text-left">{expense.amount}</td>
                <td className="py-3 px-6 text-left">{expense.date_of_expense}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpenseFilter;
