import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(false); // Track authentication errors

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("profile");
    setAuthError(false); // Reset auth error on successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("login");
    localStorage.clear();
    setAuthError(false); // Reset auth error on manual logout
  };

  const handleAuthError = () => {
    // Set auth error state and offer a re-login option
    setAuthError(true);
    setIsLoggedIn(false); // Temporarily set to false to show login prompt
  };

  const handleReauthenticate = () => {
    setPage("login"); // Show login page for re-authentication
    setAuthError(false); // Reset after user is prompted to re-login
  };

  return (
    <div style={{ padding: "20px" }}>
      <nav>
        {!isLoggedIn ? (
          <div className="nav-buttons">
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("register")}>Register</button>
            </>
          </div>
        ) : (
          <div className="nav-buttons">
            <>
              <button onClick={() => setPage("profile")}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          </div>
        )}
      </nav>

      {page === "login" && (
        <LoginPage
          navigate={handleLoginSuccess}
          authError={authError}
          onReauthenticate={handleReauthenticate}
        />
      )}
      {page === "register" && <RegisterPage />}
      {page === "profile" && isLoggedIn && (
        <ProfilePage
          onAuthError={handleAuthError} // Pass callback to handle 401 errors
        />
      )}
      {authError && !isLoggedIn && page !== "login" && (
        <div>
          <p>Сесія застаріла. Будь ласка, увійдіть знову.</p>
          <button onClick={handleReauthenticate}>Увійти знову</button>
        </div>
      )}
    </div>
  );
}

export default App;
