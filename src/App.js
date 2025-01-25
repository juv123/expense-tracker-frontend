import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Analytics from './components/Analytics';
import AddExpense from './components/AddExpense';

function App() {
  return (
    <div className="App">
      <Router>
      <div className="flex h-screen">
        {/* Sidebar (Dashboard) */}
        <Dashboard />

       
        <div className="flex-grow p-6 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/Expenses" element={<Expenses />} />
            <Route path="/Analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App;
