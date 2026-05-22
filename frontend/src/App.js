import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './components/Home';
import DonorRegister from './components/DonorRegister';
import DonorSearch from './components/DonorSearch';
import DonorUpdate from './components/DonorUpdate';
import Login from './components/Login';
import './styles/App.css';

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Blood Donor Match</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/register" className="nav-link">Register as Donor</Link>
          <Link to="/search" className="nav-link">Find Donors</Link>
          {user ? (
            <>
              <Link to="/update" className="nav-link">My Profile</Link>
              <button onClick={logout} className="nav-link nav-btn-logout">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="App">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<DonorRegister />} />
          <Route path="/search" element={<DonorSearch />} />
          <Route path="/update" element={<DonorUpdate />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Blood Donor Match &mdash; Connecting donors and recipients in critical times</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
