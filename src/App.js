import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Manager from './pages/Manager';
import VerifyKPI from './pages/VerifyKPI'; // <-- to run the VerifyKPI component
import KPIDetails from './pages/KPIDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/verify-kpi" element={<VerifyKPI />} />
          <Route path="/verify-kpi/:staffId" element={<KPIDetails />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
