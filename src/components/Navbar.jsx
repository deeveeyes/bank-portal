import React from 'react';
import './Navbar.css';
import nfsuLogo from '../assets/nfsu.png';

const Navbar = ({ user, onLogout, onNavigate }) => {
  const firstName = user ? user.full_name.split(' ')[0] : "User";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={nfsuLogo} alt="NFSU Bank Logo" className="navbar-logo" />
        <h1>NFSU Bank</h1>
      </div>
      <ul className="navbar-links">
        <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>Dashboard</a></li>
        <li><a href="#">Fixed Deposits</a></li>
        <li><a href="#">Credit Card <span className="badge">Apply Now</span></a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('transfer'); }}>Pay & Transfer</a></li>
        <li><a href="#">Investments</a></li>
        <li><a href="#">Explore Products</a></li>
        <li><a href="#">Security</a></li>
      </ul>
      <div className="navbar-profile">
        <div className="profile-container">
          <div className="profile-icon" title={user ? user.full_name : "User"}>👤</div>
          <div className="profile-dropdown">
            <div className="dropdown-header">Welcome Back, {firstName}</div>
            <ul className="dropdown-menu">
              <li><a href="#">Edit Profile</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Contact Relationship Manager</a></li>
            </ul>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;