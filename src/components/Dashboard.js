import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const Dashboard=()=>{
    const [bgcolor,setBgcolor]=useState("green-600");
        return(
        <>
           <div className="w-64 h-screen bg-green-300 text-white p-6 m-3 mt-3">
    <h2 className="text-2xl font-bold mb-6 text-white">Dashboard</h2>
    <ul>
        <li><Link to="/Expenses" className="block py-3 px-4 mb-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out">Expenses</Link></li>
        <li><Link to="/Analytics" className="block py-3 px-4 mb-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out">Analytics</Link></li>
    </ul>
</div>
</>


        

    )

}
export default Dashboard;