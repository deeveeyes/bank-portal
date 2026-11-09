import React, { useState } from 'react';
import './Login.css';
import nfsuLogo from '../assets/nfsu.png';
import bgImage from '../assets/bg.jpeg';
import ForgotPassword from './ForgotPassword';

const Login = ({ onLogin }) => {
  const [internetId, setInternetId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!internetId.trim() || !password.trim()) {
      setError('Please enter your Internet Banking ID and password.');
      return;
    }

    setLoading(true);
    try {
      // Assuming the backend is running on localhost:80/bank-portal/backend/
      // Adjust the URL if your XAMPP setup is different
      const response = await fetch('http://localhost/bank-portal/backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internetId, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        onLogin && onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server. Please ensure XAMPP is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="login-overlay"></div>
      <header className="login-header">
        <div className="brand">
          <img src={nfsuLogo} alt="NFSU Logo" className="login-logo" />
          <h1>NFSU Bank</h1>
        </div>
      </header>

      <main className="login-card">
        <h2>Internet Banking Login</h2>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span className="label-text">Internet Banking ID</span>
            <input
              type="text"
              value={internetId}
              onChange={(e) => setInternetId(e.target.value)}
              placeholder="Enter your ID"
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="label-text">Password</span>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="actions">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button 
              type="button" 
              className="link-btn"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </main>

      {showForgotPassword && (
        <ForgotPassword 
          onClose={() => setShowForgotPassword(false)} 
        />
      )}
    </div>
  );
};

export default Login;
