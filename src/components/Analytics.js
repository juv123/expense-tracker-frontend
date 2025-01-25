import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { CATEGORIES_API, EXPENSES_VIEW_API } from '../config/constants';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
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
    let categoryExpenses = categories.map((category) => ({
      category_name: category.category_name,
      amount: 0,
    }));

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

  // Custom tooltip configuration to show amount in INR
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const categoryName = tooltipItem.label;
            const expenseAmount = tooltipItem.raw;
            const formattedAmount = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(expenseAmount);
            return `${categoryName}: ${formattedAmount}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-5">
      <h3 className="text-blue-600 text-lg font-semibold mb-7 hover:text-blue-800 mt-3">
        Expense Breakdown by Category
      </h3>
      <motion.div
        className="w-3/4 mx-auto"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Doughnut data={chartData} options={options} />
      </motion.div>
    </div>
  );
};

export default Analytics;
