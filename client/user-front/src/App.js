import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [page, setPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage('profile');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('login');
    localStorage.clear(); 
  };

  return (
    <div style={{ padding: '20px' }}>
      <nav>
        {!isLoggedIn ? (
          <>
            <button onClick={() => setPage('login')}>Login</button>
            <button onClick={() => setPage('register')}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage('profile')}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      {page === 'login' && <LoginPage navigate={handleLoginSuccess} />}
      {page === 'register' && <RegisterPage />}
      {page === 'profile' && <ProfilePage />}
    </div>
  );
}

export default App;
