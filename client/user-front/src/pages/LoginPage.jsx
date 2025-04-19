import React, { useState } from "react";
import { setTokens } from "../api";
import '.././index.css';

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError(`Server error: ${res.status} ${res.statusText}`);
        return;
      }

      const text = await res.text();
      if (!text || text.trim() === "") {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text);

      const tokens = {
        access_token: data.access_token || data.accessToken || data.token,
        refresh_token: data.refresh_token || data.refreshToken || data.refresh,
      };

      setTokens(tokens);
      navigate();
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={login} className="login-form">
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
        </div>

        <div className="form-group">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
