import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import DonorRegister from './components/DonorRegister';
import DonorSearch from './components/DonorSearch';
import DonorUpdate from './components/DonorUpdate';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Blood Donor Match</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/register" className="nav-link">Register as Donor</Link>
            <Link to="/search" className="nav-link">Find Donors</Link>
            <Link to="/update" className="nav-link">Update Details</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<DonorRegister />} />
          <Route path="/search" element={<DonorSearch />} />
          <Route path="/update" element={<DonorUpdate />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Blood Donor Match &mdash; Connecting donors and recipients in critical times</p>
      </footer>
    </div>
  );
}

export default App;
