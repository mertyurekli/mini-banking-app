import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import './Accounts.css';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    accountType: 'SAVING',
    initialBalance: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();

  const accountTypes = [
    { value: 'SAVING', label: 'Savings Account' },
    { value: 'CREDIT', label: 'Credit Account' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountType) {
      newErrors.accountType = 'Please select an account type';
    }

    if (!formData.initialBalance) {
      newErrors.initialBalance = 'Initial balance is required';
    } else if (isNaN(formData.initialBalance) || parseFloat(formData.initialBalance) < 0) {
      newErrors.initialBalance = 'Initial balance must be a positive number';
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const accountData = {
        name: `${formData.accountType} Account`,
        balance: parseFloat(formData.initialBalance),
        type: formData.accountType
      };

      await accountService.createAccount(accountData);
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <h2>Create New Account</h2>
        
        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className={errors.accountType ? 'error' : ''}
            >
              <option value="">Select account type</option>
              {accountTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.accountType && <span className="error-text">{errors.accountType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="initialBalance">Initial Balance ($)</label>
            <input
              type="number"
              id="initialBalance"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              className={errors.initialBalance ? 'error' : ''}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.initialBalance && <span className="error-text">{errors.initialBalance}</span>}
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
              className="create-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount; 