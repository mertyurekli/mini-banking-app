import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import './Transactions.css';

const TransactionHistory = () => {
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (accountId) {
      fetchAccountAndTransactions();
    }
  }, [accountId]);

  const fetchAccountAndTransactions = async () => {
    try {
      setLoading(true);
      
      // Fetch account details
      const accountData = await accountService.getAccountById(accountId);
      setAccount(accountData);
      
      // Fetch transaction history
      const transactionData = await accountService.getTransactionHistory(accountId);
      console.log('Transaction data:', transactionData);
      setTransactions(transactionData);
    } catch (err) {
      setError('Failed to load transaction history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    
    try {
      console.log('Raw date string:', dateString);
      const date = new Date(dateString);
      console.log('Parsed date:', date);
      
      if (isNaN(date.getTime())) {
        console.log('Invalid date detected');
        return 'Invalid Date';
      }
      
      const formatted = date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      console.log('Formatted date:', formatted);
      return formatted;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.fromAccountId === accountId) {
      return 'outgoing';
    } else if (transaction.toAccountId === accountId) {
      return 'incoming';
    }
    return 'unknown';
  };

  const getTransactionAmount = (transaction) => {
    const type = getTransactionType(transaction);
    if (type === 'outgoing') {
      return -transaction.amount;
    } else if (type === 'incoming') {
      return transaction.amount;
    }
    return transaction.amount;
  };

  const getTransactionDescription = (transaction) => {
    const type = getTransactionType(transaction);
    if (type === 'outgoing') {
      return `Transfer to account #${transaction.toAccountNumber || 'Unknown'}`;
    } else if (type === 'incoming') {
      return `Transfer from account #${transaction.fromAccountNumber || 'Unknown'}`;
    }
    return transaction.description || 'Transaction';
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transaction history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error-message">{error}</div>
        <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-history-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="account-info">
            <h3>{account.type} Account</h3>
            <p className="account-number">#{account.number}</p>
            <p className="current-balance">Current Balance: <strong>${account.balance.toFixed(2)}</strong></p>
          </div>
        )}
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>

      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found for this account.</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map(transaction => {
            const type = getTransactionType(transaction);
            const amount = getTransactionAmount(transaction);
            const isIncoming = type === 'incoming';
            
            return (
              <div key={transaction.id} className={`transaction-item ${type}`}>
                <div className="transaction-info">
                  <div className="transaction-description">
                    {getTransactionDescription(transaction)}
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.transactionDate)}
                  </div>
                </div>
                <div className="transaction-amount">
                  <span className={`amount ${isIncoming ? 'incoming' : 'outgoing'}`}>
                    {isIncoming ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 