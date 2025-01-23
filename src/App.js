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
      <Router> {/* Ensure the Router wraps your routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Expenses" element={<Expenses />} />
        <Route path="/Analytics" element={<Analytics />} />
        <Route path="/AddExpense" element={<AddExpense />} />
    
      </Routes>
    </Router>
    </div>
  );
}

export default App;
