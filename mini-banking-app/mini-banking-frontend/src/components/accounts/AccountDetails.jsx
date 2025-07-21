import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import './Accounts.css';

const AccountDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const [accountData, transactionsData] = await Promise.all([
        accountService.getAccountById(id),
        transactionService.getTransactionsByAccount(id, { size: 10 })
      ]);
      
      setAccount(accountData);
      setTransactions(transactionsData.content || transactionsData);
    } catch (err) {
      setError('Failed to load account details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionType = (transaction) => {
    if (transaction.type === 'TRANSFER') {
      return transaction.fromAccount?.id === parseInt(id) ? 'Sent' : 'Received';
    }
    return transaction.type;
  };

  const getTransactionAmount = (transaction) => {
    const amount = transaction.amount;
    if (transaction.type === 'TRANSFER' && transaction.fromAccount?.id === parseInt(id)) {
      return `-$${amount.toFixed(2)}`;
    }
    return `+$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="account-details-container">
        <div className="loading">Loading account details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-details-container">
        <div className="error-message">{error}</div>
        <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="account-details-container">
        <div className="error-message">Account not found</div>
        <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="account-details-container">
      <div className="account-details-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Account Details</h1>
      </div>

      <div className="account-info-section">
        <div className="account-info-card">
          <div className="account-header">
            <h2>{account.accountType} Account</h2>
            <span className="account-number">#{account.accountNumber}</span>
          </div>
          
          <div className="account-balance">
            <span className="balance-label">Current Balance</span>
            <span className="balance-amount">${account.balance.toFixed(2)}</span>
          </div>

          <div className="account-details">
            <div className="detail-item">
              <span className="detail-label">Account Type:</span>
              <span className="detail-value">{account.accountType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account Number:</span>
              <span className="detail-value">{account.accountNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(account.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-active">Active</span>
            </div>
          </div>

          <div className="account-actions">
            <Link to="/transfer" className="action-button">
              Transfer Money
            </Link>
            <Link to="/transactions" className="action-button">
              View All Transactions
            </Link>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <Link to="/transactions" className="view-all-link">
            View All
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found for this account.</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-type">
                    {getTransactionType(transaction)}
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.createdAt)}
                  </div>
                </div>
                <div className="transaction-amount">
                  {getTransactionAmount(transaction)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails; 