import React, { useState } from "react";
import ".././index.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Обробник сабміту форми реєстрації
  const register = async (e) => {
    e.preventDefault(); // Запобігає перезавантаженню сторінки
    try {
      // Відправлення POST-запиту на реєстрацію користувача
      const res = await fetch("/users/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }), // Надсилання даних користувача
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registered successfully!"); // Сповіщення про успішну реєстрацію
      } else {
        alert(data.message || "Registration error"); // Відображення помилки сервера
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to connect to the server. Please try again later."); // Обробка помилки підключення
    }
  };

  return (
    <div className="form-container">
    <form onSubmit={register} className="register-form">
      <h2>Register</h2>
      <div className="form-group">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Оновлення стану username
          placeholder="Username"
          type="text"
          required
        />
      </div>
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
      <button type="submit">Register</button>
    </form>
  </div>
  );
}