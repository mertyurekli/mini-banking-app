import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import './Transactions.css';

const TransferMoney = () => {
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (err) {
      setSubmitError('Failed to load accounts. Please try again.');
    } finally {
      setAccountsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = 'Please select a source account';
    }

    if (!formData.toAccountNumber) {
      newErrors.toAccountNumber = 'Recipient account number is required';
    } else if (formData.toAccountNumber === accounts.find(acc => acc.id === formData.fromAccountId)?.number) {
      newErrors.toAccountNumber = 'Cannot transfer to the same account';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else {
      const selectedAccount = accounts.find(acc => acc.id === formData.fromAccountId);
      if (selectedAccount && parseFloat(formData.amount) > selectedAccount.balance) {
        newErrors.amount = 'Insufficient funds in the selected account';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // First, get the toAccount from account number
      const toAccount = await accountService.getAccountByNumber(formData.toAccountNumber);
      const selectedAccount = accounts.find(acc => acc.id === formData.fromAccountId);
      const transferData = {
        fromAccountNumber: selectedAccount.number,
        toAccountNumber: formData.toAccountNumber,
        amount: parseFloat(formData.amount)
      };
      await accountService.transferMoney(transferData);
      setSubmitSuccess('Transfer completed successfully!');
      
      // Reset form
      setFormData({
        fromAccountId: '',
        toAccountNumber: '',
        amount: '',
        description: ''
      });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAccount = accounts.find(acc => acc.id === formData.fromAccountId);

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <h2>Transfer Money</h2>
        
        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="success-message">
            {submitSuccess}
          </div>
        )}

        {accountsLoading ? (
          <div className="loading">Loading your accounts...</div>
        ) : (
          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-group">
              <label htmlFor="fromAccountId">From Account</label>
              <select
                id="fromAccountId"
                name="fromAccountId"
                value={formData.fromAccountId}
                onChange={handleChange}
                className={errors.fromAccountId ? 'error' : ''}
              >
                <option value="">Select source account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.type} - #{account.number} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              {errors.fromAccountId && <span className="error-text">{errors.fromAccountId}</span>}
            </div>

            {selectedAccount && (
              <div className="account-balance-info">
                <p>Available Balance: <strong>${selectedAccount.balance.toFixed(2)}</strong></p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="toAccountNumber">To Account Number</label>
              <input
                type="text"
                id="toAccountNumber"
                name="toAccountNumber"
                value={formData.toAccountNumber}
                onChange={handleChange}
                className={errors.toAccountNumber ? 'error' : ''}
                placeholder="Enter recipient account number"
              />
              {errors.toAccountNumber && <span className="error-text">{errors.toAccountNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter transfer description"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="transfer-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Transfer Money'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransferMoney; 