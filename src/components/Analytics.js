import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { CATEGORIES_API, EXPENSES_VIEW_API } from '../config/constants';
import { useNavigate } from 'react-router-dom';


ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const navigate=useNavigate();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenses - Category',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const goBackToPreviousPage=()=>{
    navigate(-1)
 }

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(CATEGORIES_API);
        const expensesResponse = await axios.get(EXPENSES_VIEW_API);

        setCategories(categoriesResponse.data);
        setExpenses(expensesResponse.data);
        makeChartData(expensesResponse.data, categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);


  const makeChartData = (expenses, categories) => {
   
    let categoryExpenses = categories.map((category) => {
      return {
        category_name: category.category_name,
        amount: 0,
      };
    });

    expenses.forEach((expense) => {
      const categoryIndex = categoryExpenses.findIndex(
        (item) => item.category_name === expense.category?.category_name
      );
      if (categoryIndex >= 0) {
        categoryExpenses[categoryIndex].amount += expense.amount;
      }
    });

    
    const labels = categoryExpenses.map((item) => item.category_name);
    const data = categoryExpenses.map((item) => item.amount);

    setChartData((prevState) => ({
      ...prevState,
      labels,
      datasets: [
        {
          ...prevState.datasets[0],
          data,
          backgroundColor: data.map(() => getRandomColor()),
        },
      ],
    }));
  };

 
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4">
      <button className="btnBack" onClick={goBackToPreviousPage}>{"<< Back"}</button>
      <h3 className="text-gray-800 text-lg font-semibold mb-4">Expense Breakdown by Category</h3>
      <div className="w-3/4 mx-auto my-6">
        <Doughnut data={chartData} />
      </div>
      
    </div>
    
  );
};

export default Analytics;
