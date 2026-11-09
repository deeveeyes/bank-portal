import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onNavigate }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // Fallback if user is null (shouldn't happen if protected by App)
  if (!user) return <div>Loading...</div>;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome back, {user.full_name}</h2>
        <div className="account-info">
          <p className="account-number">
            Account: {showAccount ? user.account_number : `XXXX-XXXX-${user.account_number.slice(-4)}`}
          </p>
          <button 
            className="toggle-btn-small"
            onClick={() => setShowAccount(!showAccount)}
          >
            {showAccount ? 'Hide' : 'Show'}
          </button>
        </div>
      </header>

      <div className="main-cards">
        <div className="card balance-card">
          <h3>Total Balance</h3>
          <div className="balance-display">
            <h1>{showBalance ? formatCurrency(user.balance) : '••••••'}</h1>
            <button 
              className="toggle-btn"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="update-text">Last updated: Just now</p>
        </div>

        <div className="metrics-grid">
          <div className="card metric-card">
            <h3>Reward Points</h3>
            <div className="metric-value">{user.reward_points}</div>
            <p className="metric-sub">Redeem now</p>
          </div>

          <div className="card metric-card">
            <h3>Investments</h3>
            <div className="metric-value">{formatCurrency(user.investments)}</div>
            <p className="metric-sub">+5.2% this month</p>
          </div>

          <div className="card metric-card">
            <h3>Total Spends</h3>
            <div className="metric-value">{formatCurrency(user.total_spends)}</div>
            <p className="metric-sub">November 2025</p>
          </div>

          <div className="card metric-card">
            <h3>Credit Limit</h3>
            <div className="metric-value">{formatCurrency(user.credit_limit)}</div>
            <p className="metric-sub">75% available</p>
          </div>
        </div>
      </div>


      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => onNavigate('transfer')}>Send Money</button>
          <button>Pay Bills</button>
          <button onClick={() => onNavigate('statement')}>Statement</button>
          <button>Support</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
