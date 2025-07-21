import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AccountDetails from './components/accounts/AccountDetails';
import TransferMoney from './components/transactions/TransferMoney';
import TransactionHistory from './components/transactions/TransactionHistory';
import CreateAccount from './components/accounts/CreateAccount';
import Navbar from './components/layout/Navbar';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account/:id" 
                element={
                  <ProtectedRoute>
                    <AccountDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transfer" 
                element={
                  <ProtectedRoute>
                    <TransferMoney />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions/:accountId" 
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-account" 
                element={
                  <ProtectedRoute>
                    <CreateAccount />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
