import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { accountService } from '../../services/accountService';
import EditAccountForm from './EditAccountForm';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Only fetch accounts if user is authenticated
    if (isAuthenticated && !authLoading) {
      fetchAccounts();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    (account.number && account.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.type && account.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const handleDeleteAccount = async (accountId) => {
    console.log('=== DELETE ACCOUNT START ===');
    console.log('Account ID to delete:', accountId);
    console.log('Account ID type:', typeof accountId);
    console.log('Current accounts before delete:', accounts);
    
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        console.log('User confirmed deletion, calling API...');
        
        const result = await accountService.deleteAccount(accountId);
        console.log('Delete API result:', result);
        
        // Update the accounts list by filtering out the deleted account
        const updatedAccounts = accounts.filter(account => account.id !== accountId);
        console.log('Updated accounts after filter:', updatedAccounts);
        console.log('Original accounts count:', accounts.length);
        console.log('Updated accounts count:', updatedAccounts.length);
        
        console.log('Setting accounts state with:', updatedAccounts);
        setAccounts(prevAccounts => {
          console.log('Previous accounts in setState:', prevAccounts);
          console.log('New accounts to set:', updatedAccounts);
          return updatedAccounts;
        });
        setError('');
        console.log('=== DELETE ACCOUNT SUCCESS ===');
      } catch (err) {
        console.error('=== DELETE ACCOUNT ERROR ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        setError(`Failed to delete account: ${err.response?.data?.message || err.message}`);
      }
    } else {
      console.log('User cancelled deletion');
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowEditModal(true);
  };

  const handleUpdateAccount = async (updatedAccount) => {
    try {
      const result = await accountService.updateAccount(updatedAccount.id, updatedAccount);
      setAccounts(accounts.map(account => 
        account.id === result.id ? result : account
      ));
      setShowEditModal(false);
      setEditingAccount(null);
      setError('');
    } catch (err) {
      setError('Failed to update account. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="main-content">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Access Required</h2>
            <p className="card-subtitle">Please log in to view your dashboard</p>
          </div>
          <Link to="/login" className="auth-button">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.username}!</h1>
        <p className="dashboard-subtitle">Here's an overview of your accounts</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Summary</h2>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <h3 className="text-gray-700 font-semibold mb-2">Total Balance</h3>
            <p className="text-2xl font-bold text-green-500">${totalBalance.toFixed(2)}</p>
          </div>
          <div className="flex-1 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
            <h3 className="text-gray-700 font-semibold mb-2">Total Accounts</h3>
            <p className="text-2xl font-bold text-blue-600">{accounts.length}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/create-account" className="action-button flex-1 text-center">
            Create Account
          </Link>
          <Link to="/transfer" className="action-button flex-1 text-center">
            Transfer Money
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Your Accounts</h2>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-group input w-full"
              />
            </div>
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <p className="text-gray-600">No accounts found matching "{searchTerm}"</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">You don't have any accounts yet.</p>
                <Link to="/create-account" className="action-button">
                  Create your first account
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map(account => (
              <div key={account.id} className="account-card">
                <div className="mb-4">
                  <span className="account-type">{account.type}</span>
                </div>
                <div className="mb-4">
                  <p className="account-number">#{account.number}</p>
                  <p className="account-balance">${account.balance.toFixed(2)}</p>
                </div>
                <div className="account-actions">
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="edit-button"
                      title="Edit Account"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => {
                        console.log('Delete button clicked for account:', account);
                        console.log('Account ID:', account.id);
                        console.log('Account ID type:', typeof account.id);
                        handleDeleteAccount(account.id);
                      }}
                      className="delete-button"
                      title="Delete Account"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <Link 
                    to={`/transactions/${account.id}`} 
                    className="action-button w-full text-center"
                    title="View Transactions"
                  >
                    View Transactions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Account Modal */}
      {showEditModal && editingAccount && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Account</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <EditAccountForm
              account={editingAccount}
              onUpdate={handleUpdateAccount}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 