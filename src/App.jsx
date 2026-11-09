import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Transfer from './components/Transfer';
import Statement from './components/Statement';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleUpdateBalance = (newBalance) => {
    setUser(prevUser => ({
      ...prevUser,
      balance: newBalance
    }));
  };

  return (
    <div className="app">
      {isAuthenticated && user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
          {currentView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
          {currentView === 'transfer' && <Transfer user={user} onBack={() => setCurrentView('dashboard')} onTransactionSuccess={handleUpdateBalance} />}
          {currentView === 'statement' && <Statement user={user} onBack={() => setCurrentView('dashboard')} />}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App