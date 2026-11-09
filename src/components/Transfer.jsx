import React, { useState } from 'react';
import './Transfer.css';

const Transfer = ({ user, onBack, onTransactionSuccess }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Confirmation
  const [formData, setFormData] = useState({
    payeeAccount: '',
    amount: '',
    comments: '',
    mode: 'IMPS'
  });
  const [otp, setOtp] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.payeeAccount || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost/bank-portal/backend/transfer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: user.id,
          payeeAccount: formData.payeeAccount,
          amount: formData.amount,
          mode: formData.mode,
          comments: formData.comments
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPaymentId(data.transaction_id);
        if (onTransactionSuccess && data.new_balance !== undefined) {
          onTransactionSuccess(data.new_balance);
        }
        setStep(3);
      } else {
        setError(data.message || 'Transfer failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <div className="transfer-header">
          {step !== 3 && <button className="back-btn" onClick={onBack}>← Back</button>}
          <h2>Money Transfer</h2>
        </div>

        {step === 1 && (
          <form onSubmit={handleFormSubmit} className="transfer-form">
            {error && <div className="error-msg">{error}</div>}
            
            <div className="form-group">
              <label>Payee Account Number</label>
              <input
                type="text"
                name="payeeAccount"
                value={formData.payeeAccount}
                onChange={handleInputChange}
                placeholder="Enter account number"
              />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>

            <div className="form-group">
              <label>Transfer Mode</label>
              <div className="radio-group">
                <label className={`radio-label ${formData.mode === 'IMPS' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="mode"
                    value="IMPS"
                    checked={formData.mode === 'IMPS'}
                    onChange={handleInputChange}
                  />
                  IMPS
                </label>
                <label className={`radio-label ${formData.mode === 'NEFT' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="mode"
                    value="NEFT"
                    checked={formData.mode === 'NEFT'}
                    onChange={handleInputChange}
                  />
                  NEFT
                </label>
                <label className={`radio-label ${formData.mode === 'RTGS' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="mode"
                    value="RTGS"
                    checked={formData.mode === 'RTGS'}
                    onChange={handleInputChange}
                  />
                  RTGS
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Comments (Optional)</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="What is this for?"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="otp-form">
            <h3>Verify Transaction</h3>
            <p>Enter the OTP sent to your mobile number to confirm payment of <strong>{formatCurrency(formData.amount)}</strong> to <strong>{formData.payeeAccount}</strong>.</p>
            
            {error && <div className="error-msg">{error}</div>}
            
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="otp-input"
            />
            
            <button type="submit" className="primary-btn">Confirm Payment</button>
          </form>
        )}

        {step === 3 && (
          <div className="confirmation-view">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p className="payment-id">Transaction ID: {paymentId}</p>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Paid to</span>
                <strong>{formData.payeeAccount}</strong>
              </div>
              <div className="summary-row">
                <span>Amount</span>
                <strong className="amount-text">{formatCurrency(formData.amount)}</strong>
              </div>
              <div className="summary-row">
                <span>Mode</span>
                <span>{formData.mode}</span>
              </div>
              {formData.comments && (
                <div className="summary-row">
                  <span>Comments</span>
                  <span>{formData.comments}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Date</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>

            <button className="primary-btn" onClick={onBack}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;
