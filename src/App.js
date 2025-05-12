import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Logout from './pages/Logout';

import Manager from './pages/Manager';
import Staff from './pages/Staff';

import VerifyKPI from './pages/VerifyKPI';
import KPIDetails from './pages/KPIDetails';
import KPIManagement from './pages/KPIManagement'; 

import SessionManager from './components/SessionManager';

function App() {
  return (
    <Router>
      <SessionManager/>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/verify-kpi" element={<VerifyKPI />} />
          <Route path="/kpi-details/:staffId" element={<KPIDetails />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/kpi-management" element={<KPIManagement />} />
          
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
