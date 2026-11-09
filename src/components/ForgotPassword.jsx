import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = ({ onClose, onPasswordReset }) => {
  const [step, setStep] = useState(1); // 1: ID, 2: OTP, 3: New Password
  const [internetId, setInternetId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!internetId.trim()) {
      setError('Please enter your Internet Banking ID');
      return;
    }

    setLoading(true);
    try {
      // Verify if user exists
      const response = await fetch('http://localhost/bank-portal/backend/check_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internetId })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // User exists, proceed to OTP step
        setStep(2);
        setMessage('OTP sent to your registered mobile number ending in **89');
      } else {
        setError(data.message || 'Internet Banking ID not found');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setStep(3);
    setMessage('');
    setError('');
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/bank-portal/backend/reset_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internetId, newPassword })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Password reset successful! Please login with your new password.');
        onClose();
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-card">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Reset Password</h2>
        
        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleIdSubmit}>
            <p>Enter your Internet Banking ID to receive an OTP.</p>
            <input
              type="text"
              placeholder="Internet Banking ID"
              value={internetId}
              onChange={(e) => setInternetId(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <p>Enter the 6-digit OTP sent to your mobile.</p>
            <input
              type="text"
              placeholder="Enter OTP (Use 123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
            />
            <button type="submit" className="fp-btn">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <p>Set your new password.</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
