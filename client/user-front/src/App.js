import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [page, setPage] = useState('login');

  return (
    <div style={{ padding: '20px' }}>
      <nav>
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('register')}>Register</button>
        <button onClick={() => setPage('profile')}>Profile</button>
      </nav>

      {page === 'login' && <LoginPage navigate={setPage} />}
      {page === 'register' && <RegisterPage />}
      {page === 'profile' && <ProfilePage />}
    </div>
  );
}

export default App;
