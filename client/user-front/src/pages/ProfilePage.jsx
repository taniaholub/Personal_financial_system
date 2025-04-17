import React, { useEffect, useState } from "react";
import { fetchWithAuth, getTokenPayload } from "../api";

function ProfilePage() {
  // State for different data types
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalsError, setGoalsError] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[ProfilePage] Fetching user profile...');
    
    // Get memberId from token
    const payload = getTokenPayload();
    if (!payload || !payload.memberId) {
      setError("Invalid authentication token");
      setIsLoading(false);
      return;
    }
    
    const memberId = payload.memberId;
    console.log(`[ProfilePage] Using memberId: ${memberId}`);
    
    // Fetch user profile data
    fetchWithAuth(`/users`)
      .then(async (res) => {
        console.log('[ProfilePage] /users status:', res.status);
        if (!res.ok) {
          const errorData = await res.json().catch(() => null) || { message: res.statusText };
          console.error('[ProfilePage] Failed to fetch profile:', errorData);
          throw new Error(errorData.message || 'Failed to load profile');
        }
        return res.json();
      })
      .then((data) => {
        console.log('[ProfilePage] Profile data received:', data);
        setProfile(data);
        
        // After successfully fetching profile, get transactions and goals
        fetchTransactions(memberId);
        fetchGoals(memberId);
      })
      .catch((err) => {
        console.error('[ProfilePage] Failed to load profile:', err.message);
        setError(err.message || "Unauthorized or fetch failed");
        setIsLoading(false);
      });
  }, []);

  // Fetch transaction data
  const fetchTransactions = (userId) => {
    console.log(`[ProfilePage] Fetching transactions for user ${userId}`);
    fetchWithAuth(`/transactions/${userId}/summary`)
      .then(async (res) => {
        console.log('[ProfilePage] /transactions/:userId/summary status:', res.status);
        if (!res.ok) {
          const errorData = await res.json().catch(() => null) || { message: res.statusText };
          console.error('[ProfilePage] /transactions failed:', errorData);
          throw new Error(errorData.message || 'Failed to fetch transactions');
        }
        return res.json();
      })
      .then((data) => {
        console.log('[ProfilePage] Transaction data:', data);
        setTransactions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[ProfilePage] Error fetching transactions:', err.message);
        setIsLoading(false);
      });
  };

  // Fetch goals data with improved error handling
  const fetchGoals = (userId) => {
    fetchWithAuth(`/goals/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null) || { message: res.statusText };
          setGoalsError(`Не вдалося завантажити цілі: ${errorData.message || res.statusText}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setGoals(Array.isArray(data) ? data : []);
          setGoalsError(null); // прибираємо помилку, якщо дані успішно отримано
        }
      })
      .catch((err) => {
        setGoalsError(`Не вдалося завантажити цілі: ${err.message}`);
      });
  };
  

  return (
    <div className="profile-container">
      <h2>Профіль користувача</h2>
      
      {isLoading && <p>Завантаження профілю...</p>}
      
      {error && (
        <div className="error">
          <p>Помилка: {error}</p>
        </div>
      )}
      
      {profile && (
        <div className="profile-section">
          <h3>Особиста інформація</h3>
          <p>Ім'я користувача: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <p>ID користувача: {profile.id}</p>
        </div>
      )}
      
      {transactions && (
        <div className="transaction-section">
          <h3>Фінансова статистика</h3>
          <p>Доходи: {transactions.income} грн</p>
          <p>Витрати: {transactions.expense} грн</p>
          <p>Баланс: {transactions.income - transactions.expense} грн</p>
        </div>
      )}
      
      <div className="goals-section">
        <h3>Фінансові цілі</h3>
        {goalsError && (
          <div className="error-message">
            <p>{goalsError}</p>
          </div>
        )}
        
        {!goalsError && goals.length === 0 && (
          <p>У вас ще немає фінансових цілей</p>
        )}
        
        {goals.length > 0 && (
          <ul>
            {goals.map(goal => (
              <li key={goal.id}>
                <p><strong>{goal.goal_name}</strong></p>
                <p>Накопичено: {goal.current_amount} грн із {goal.target_amount} грн</p>
                <p>Статус: {goal.status === 'in_progress' ? 'В процесі' : 
                           goal.status === 'completed' ? 'Виконано' : 'Не виконано'}</p>
                <p>Дедлайн: {new Date(goal.deadline).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;