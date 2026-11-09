import React, { useState, useEffect } from 'react';
import './Statement.css';

const Statement = ({ user, onBack }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost/bank-portal/backend/transactions.php?user_id=${user.id}`);
        const data = await response.json();

        if (data.status === 'success') {
          setTransactions(data.data);
        } else {
          setError(data.message || 'Failed to fetch transactions');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="statement-container">
      <div className="statement-card">
        <div className="statement-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>Account Statement</h2>
        </div>

        <div className="account-summary">
          <p>Account Number: <strong>{user.account_number}</strong></p>
          <p>Available Balance: <strong>{formatCurrency(user.balance)}</strong></p>
        </div>

        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="no-data">No transactions found.</div>
        ) : (
          <div className="table-responsive">
            <table className="statement-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Transaction ID</th>
                  <th>Payee Account</th>
                  <th>Mode</th>
                  <th>Remarks</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{formatDate(txn.created_at)}</td>
                    <td className="mono">{txn.transaction_id}</td>
                    <td>{txn.receiver_account}</td>
                    <td>{txn.mode}</td>
                    <td>{txn.comments || '-'}</td>
                    <td className="amount-debit">-{formatCurrency(txn.amount)}</td>
                    <td>
                      <span className={`status-badge ${txn.status.toLowerCase()}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td>{txn.balance_after ? formatCurrency(txn.balance_after) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statement;
