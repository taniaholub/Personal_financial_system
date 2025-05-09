import React, { useState } from "react";
import { setTokens } from "../api";
import '.././index.css';

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Обробник сабміту форми входу
  const login = async (e) => {
    e.preventDefault(); // Запобігає перезавантаженню сторінки
    setIsLoading(true); // Вмикає індикатор завантаження
    setError(""); // Скидає попередню помилку

    try {
      // Відправлення POST-запиту на авторизацію користувача
      const res = await fetch(`/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Надсилання даних користувача
      });

      // Обробка відповіді сервера з кодом помилки
      if (!res.ok) {
        setError(`Server error: ${res.status} ${res.statusText}`);
        return;
      }

      const text = await res.text();
      // Перевірка, що відповідь не порожня
      if (!text || text.trim() === "") {
        throw new Error("Empty response from server");
      }

      // Парсинг відповіді в об'єкт
      const data = JSON.parse(text);

      // Універсальний спосіб отримання токенів
      const tokens = {
        access_token: data.access_token || data.accessToken || data.token,
        refresh_token: data.refresh_token || data.refreshToken || data.refresh,
      };

      setTokens(tokens); // Зберігає токени в локальне сховище або деінде
      navigate(); // Переходить на іншу сторінку після входу
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false); // Вимикає індикатор завантаження
    }
  };

  return (
    <div>
      <form onSubmit={login} className="login-form">
        <h2>Login</h2>

        {/* Відображення помилки, якщо вона є */}
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Оновлення стану email
            placeholder="Email"
            type="email"
            required
          />
        </div>

        <div className="form-group">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Оновлення стану пароля
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"} {}
        </button>
      </form>
    </div>
  );
}
