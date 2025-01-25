import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EXPENSE_BETWEEN_DATES_API, EXPENSES_VIEW_API, CATEGORIES_API } from '../config/constants';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]); // Initialize with an empty array
  const [filteredExpenses, setFilteredExpenses] = useState([]); // Initialize with an empty array
  const [categories, setCategories] = useState([]); // For storing categories
  const [filters, setFilters] = useState({ from: '', to: '', category_id: '' });
  
  // Fetch all expenses and categories on component mount
  useEffect(() => {
    // Fetch expenses
    axios
      .get(EXPENSES_VIEW_API)
      .then((response) => {
        setExpenses(response.data);
        setFilteredExpenses(response.data); // Default to show all expenses
      })
      .catch((error) => console.error('Error fetching expenses:', error));

    // Fetch categories
    axios
      .get(CATEGORIES_API)
      .then((response) => {
        setCategories(response.data); // Set categories
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);
  
 
  // Function to fetch filtered expenses based on date range and category
  const fetchExpensesByFilter = async () => {
    try {
      const response = await axios.get(EXPENSE_BETWEEN_DATES_API, {
        params: {
          from: filters.from,
          to: filters.to,
          category_id: filters.category_id,
        },
      });
      setFilteredExpenses(response.data); // Update filtered results
    } catch (error) {
      console.error('Error fetching filtered expenses:', error);
    }
  };

  // Handle form inputs for date filters and category filter
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to apply the filter
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    fetchExpensesByFilter(); // Fetch filtered expenses
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
                className="block py-3 px-4 mb-2 rounded-lg bg-green-300 hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Add Expense
              </Link>
            </li>
          </ul>
        </div>
       
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto p-6 m-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-lg font-medium" htmlFor="from">
                From
              </label>
              <input
                type="date"
                id="from"
                name="from"
                value={filters.from}
                onChange={handleChange}
                className="w-full h-9 px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-lg font-medium" htmlFor="to">
                To
              </label>
              <input
                type="date"
                id="to"
                name="to"
                value={filters.to}
                onChange={handleChange}
                className="w-full h-9 px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="category_id" className="block text-lg font-medium">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={filters.category_id}
                onChange={handleChange}
                className="w-full h-9 px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Filter
            </button>
          </div>
        </form>

        <table className="min-w-full bg-white mt-6">
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
            {filteredExpenses.map((expense, index) => (
              <tr
                className="border-b border-gray-200 hover:bg-gray-100"
                key={expense.id}
              >
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{expense?.category?.category_name}</td>
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

export default Expenses;
