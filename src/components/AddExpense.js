import React, { useEffect, useState } from 'react';
import { CATEGORIES_API, EXPENSES_ADD_API } from '../config/constants';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddExpense = () => {
  const [expenseData, setExpenseData] = useState({
     category_id: '' ,
     amount:'',
     description:'',
    date_of_expense:''
});
  
   const [categories,setCategories]=useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
      };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

const handleCancel = () => {
    setExpenseData({
        category_id: '',
        description: '',
        amount: '',
        date_of_expense: '',
    });
};
useEffect(() => {
    axios.get(CATEGORIES_API)  
        .then(response => setCategories(response.data))
        .catch(error => console.error('Error fetching categories:', error));
}, []);

const handleSubmit = async(e) => {
    e.preventDefault();
   // console.log('sub');
    console.log(expenseData); 
    try {
        const response = await axios.post(EXPENSES_ADD_API, expenseData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        toast.success(
            <>
                New Expense '{expenseData.description}'.'has been added'
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
        ); console.log('New Expense has been created:', response.data);
       
    } catch (error) {
        toast.error('Something went wrong. Please fill all the details and book the ride again!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        console.error('Error in adding expense:', error.response?.data || error.message);
    }
    handleCancel();
   
};

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add Expense</h2>
    
    <form onSubmit={handleSubmit}>
    <ToastContainer />
        <div className="mb-4">
            <label htmlFor="category_id" className="block text-lg font-medium ">Category</label>
            <select
                id="category_id"
                name="category_id"
                value={expenseData.category_id}
                onChange={handleChange}
                required
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

        <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-medium">Description</label>
            <textarea 
                name="description" 
                id="description" 
                rows="4" 
                onChange={handleChange}
                value={expenseData.description}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
            ></textarea>
        </div>

        <div className="mb-4">
            <label htmlFor="amount" className="block text-lg font-medium ">Amount</label>
            <input 
                type="number"
                name="amount" 
                id="amount" 
                value={expenseData.amount}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="date_of_expense" className="block text-lg font-medium ">Date</label>
            <input
                type="date"
                id="date_of_expense"
                name="date_of_expense"
                value={expenseData.date_of_expense}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50 text-gray-700"
            />
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6">
            <button 
                type="submit" 
                className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
            >
                Add
            </button>
            <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
                Cancel
            </button>
        </div>

    </form>
</div>

  );
};

export default AddExpense;
