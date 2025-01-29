import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EXPENSE_BETWEEN_DATES_API, EXPENSES_VIEW_API, CATEGORIES_API } from '../config/constants';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const Expenses = () => {
  const [expenses, setExpenses] = useState([]); // Initialize with an empty array
  const [filteredExpenses, setFilteredExpenses] = useState([]); // Initialize with an empty array
  const [categories, setCategories] = useState([]); // For storing categories
  const [filters, setFilters] = useState({ from: '', to: '', category_id: '' });
  const[editable,setEditable]=useState(null);
  const[updatedExpense,setUpdatedExpense]=useState([]);
  
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
      const response = await axios.post(EXPENSE_BETWEEN_DATES_API, 
        {
          from: filters.from,
          to: filters.to,
          category_id: filters.category_id,
        },
      );
      setFilteredExpenses(response?.data);
    } catch (error) {
      console.error("Error fetching filtered expenses:", error);
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
   const editExpense=(expense)=>{
    setEditable(expense.id);//sets expense id of expense to be edit in editable var
    setUpdatedExpense({...expense});
   }
   const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedExpense(prev => ({ ...prev, [name]: value }));
  };

  // Save Edited Expense
  const saveExpense = async () => {
    try {
      await axios.put(`${EXPENSES_VIEW_API}/${updatedExpense.id}/edit`, updatedExpense);
      setFilteredExpenses(filteredExpenses.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp)));
      setEditable(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };
  const cancelEdit = () => {
    setEditable(null);
  };

  // Delete Expense
  const deleteExpense = async (expense) => {
    if (window.confirm('Are you sure you want to remove this expense?')) {
      try {
        await axios.delete(`${EXPENSES_VIEW_API}/${expense.id}/delete`);
        setFilteredExpenses(filteredExpenses.filter(exp => exp.id !== expense.id));
           toast.success(
                <>
                  <span className='text-red-500'>{expense.description}</span>&nbsp;&nbsp;has been removed.
                  <br />
                </>,
                {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
              );
      } catch (error) {
         toast.error('Something went wrong. Please fill all the details and try again!', {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
        console.error('Error deleting expense:', error);
      }
    }
  };
  
  // Define a color array to be used for categories
  const colors = [
    'bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100',
    'bg-orange-400', 'bg-violet-400', 'bg-green-400', 'bg-indigo-400'
  ];

  // Cache colors for each category to ensure they are consistent
  const categoryColors = {};

  // Function to get a unique color for each category dynamically
  const getCategoryColor = (category) => {
    if (!categoryColors[category]) {
      // Assign a random color to the category
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      categoryColors[category] = randomColor;
    }
    return categoryColors[category];
  };


  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0)
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
            <ToastContainer />
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
                className="w-full h-10 px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
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
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-center italic">
            {filteredExpenses.map((expense, index) => (
              <tr
                className={`border-b border-gray-200 hover:bg-gray-100 ${getCategoryColor(expense.category.id)}` }
                key={expense.id}
              >
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left"> {editable === expense.id ? (
                    <input type="text" name="category" value={updatedExpense.category.category_name || ''} onChange={handleEditChange} />
                  ) : (expense.category ? expense.category.category_name : 'N/A')}</td>
                <td className="py-3 px-6 text-left"> {editable === expense.id ? (
                    <input type="text" name="description" value={updatedExpense.description|| ''} onChange={handleEditChange} />
                  ) : (expense?.description)}</td>
                <td className="py-3 px-6 text-left"> {editable === expense.id ? (
                    <input type="number" name="amount" value={updatedExpense.amount || ''} onChange={handleEditChange} />
                  ) : (expense?.amount)}</td>
                <td className="py-3 px-6 text-left">{editable === expense.id ? (
                    <input type="date" name="date_of_expense" value={updatedExpense?.date_of_expense || ''} onChange={handleEditChange} />
                  ) : (expense?.date_of_expense)}</td>
                <td className="py-3 px-6">
                  {editable === expense.id ? (
                    <>
                      <button onClick={saveExpense}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => editExpense(expense)}>Edit | </button>
                      <button onClick={() => deleteExpense(expense)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td className="px-4 py-2 border font-bold text-blue-500">Total Amount</td>
            <td className="px-4 py-2 border font-bold text-red-500 hover:text-red-800">Rs.{totalAmount}</td>
          </tr>
        </tfoot>
        </table>
     
      </div>
    </>
  );
};

export default Expenses;
