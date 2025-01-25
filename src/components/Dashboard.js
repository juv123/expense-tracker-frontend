import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const Dashboard=()=>{
    return(
        <>
           <div class="w-64 h-screen bg-green-300 text-white p-6 m-3">
    <h2 class="text-2xl font-bold mb-6 text-white">Dashboard</h2>
    <ul>
        <li><Link to="/Expenses" class="block py-3 px-4 mb-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out">Expenses</Link></li>
        <li><Link to="/Analytics" class="block py-3 px-4 mb-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out">Analytics</Link></li>
    </ul>
</div>
</>


        

    )

}
export default Dashboard;