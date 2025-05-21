// src/components/UI/GoalsList.jsx
import React, { useState } from 'react';
import { formatDate, calculateProgress } from "../../utils/utils"; 
import { fetchWithAuth } from "../../api"; 
import GoalForm from '../forms/GoalForm.jsx'; 

const GoalsList = ({ goals, userId, onGoalUpdated }) => {

  const [editingGoalId, setEditingGoalId] = useState(null); // ID цілі, яка редагується
  const [showGoalForm, setShowGoalForm] = useState(false); // Показати/сховати форму
  
  const initialGoalData = {
    goal_name: '',
    target_amount: '',
    current_amount: '',
    deadline: new Date().toISOString().split('T')[0], // За замовчуванням сьогодні
  };
  const [newGoalData, setNewGoalData] = useState(initialGoalData);

  if (!userId && goals.length === 0) { 
    console.warn("[GoalsList] userId is undefined. Form functionality will be limited.");
  }

  const getGoalStatusText = (status) => {
    switch (status) {
      case "in_progress": return "В процесі";
      case "completed": return "Завершена";
      case "failed": return "Невдала";
      default: return status || "Невідомий";
    }
  };

  const handleEditGoalClick = (goal) => {
    setEditingGoalId(goal.id);
    setNewGoalData({
      goal_name: goal.goal_name,
      target_amount: String(goal.target_amount), 
      current_amount: String(goal.current_amount), 
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '', 
    });
    setShowGoalForm(true);
  };

  const handleSaveGoal = async () => { // Ця функція викликається з GoalForm при сабміті
    if (!userId) {
      alert("Помилка: ID користувача не визначено. Неможливо зберегти ціль.");
      return;
    }

    // Валідація перед відправкою
    if (!newGoalData.goal_name.trim()) {
      alert("Назва цілі не може бути порожньою.");
      return;
    }
    if (isNaN(parseFloat(newGoalData.target_amount)) || parseFloat(newGoalData.target_amount) <= 0) {
      alert("Цільова сума має бути позитивним числом.");
      return;
    }
    const currentAmount = newGoalData.current_amount ? parseFloat(newGoalData.current_amount) : 0;
    if (isNaN(currentAmount) || currentAmount < 0) {
      alert("Поточна сума має бути невід'ємним числом.");
      return;
    }
    if (currentAmount > parseFloat(newGoalData.target_amount)) {
        alert("Поточна сума не може бути більшою за цільову суму.");
        return;
    }
    if (!newGoalData.deadline) {
        alert("Будь ласка, вкажіть термін досягнення цілі.");
        return;
    }


    const goalPayload = {
      goal_name: newGoalData.goal_name.trim(),
      target_amount: Number(newGoalData.target_amount),
      current_amount: Number(newGoalData.current_amount) || 0,
      deadline: newGoalData.deadline,
    };

    try {
      let response;
      if (editingGoalId) {
        response = await fetchWithAuth(`/goals/${editingGoalId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalPayload),
        });
      } else {
        // Додавання нової цілі (POST)
        const payloadForPost = {
          ...goalPayload,
          user_id: userId,
          status: 'in_progress', // Нові цілі за замовчуванням "в процесі"
        };
        response = await fetchWithAuth('/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadForPost),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          alert('Авторизація не вдалася. Будь ласка, увійдіть знову.');
          throw new Error('Unauthorized'); 
        }
        throw new Error(`Не вдалося зберегти ціль: ${errorText} (Статус: ${response.status})`);
      }

      setShowGoalForm(false);
      setEditingGoalId(null);
      setNewGoalData(initialGoalData); // Скидаємо форму

      if (typeof onGoalUpdated === 'function') {
        onGoalUpdated(); // Повідомляємо батьківський компонент про необхідність оновити дані
      } else {
        console.warn("[GoalsList] onGoalUpdated callback is not provided. The list might not refresh automatically.");
      }
      //alert(editingGoalId ? 'Ціль успішно оновлено!' : 'Ціль успішно додано!');

    } catch (error) {
      console.error('Error saving goal:', error);
      if (error.message !== 'Unauthorized') { // Не показуємо дублюючий alert, якщо вже був про 401
        alert('Помилка при збереженні цілі: ' + error.message);
      }
    }
  };

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoalData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="summary-box goals-list-container"> {}
      <h3>Фінансові цілі</h3>
      {goals && goals.length > 0 ? (
        <ul>
          {goals.map((goal) => {
            const currentAmount = Number(goal.current_amount) || 0;
            const targetAmount = Number(goal.target_amount) || 0;
            const progress = calculateProgress(currentAmount, targetAmount);

            const statusClass =
              goal.status === "in_progress" ? "status-active"
              : goal.status === "completed" ? "status-completed"
              : "status-failed";

            return (
              <li
                key={goal.id}
                className={`goal-item ${
                  goal.status === "completed" ? "goal-completed"
                  : goal.status === "failed" ? "goal-failed"
                  : "goal-active"
                }`}
              >
                <p><strong>{goal.goal_name}</strong></p>
                {targetAmount > 0 && (
                  <>
                    <p>
                      Прогрес: {currentAmount.toFixed(0)} / {targetAmount.toFixed(0)} грн ({progress.toFixed(0)}%)
                    </p>
                    <div
                      style={{
                        width: "100%", backgroundColor: "#e0e0e0", borderRadius: "4px",
                        height: "10px", marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          backgroundColor:
                            goal.status === "completed" ? "#4caf50"
                            : goal.status === "failed" ? "#f44336"
                            : "#2196f3",
                          height: "100%", borderRadius: "4px",
                          transition: "width 0.3s ease-in-out",
                        }}
                      ></div>
                    </div>
                  </>
                )}
                <p>Термін: {formatDate(goal.deadline)}</p>
                <p>
                  Статус: <span className={`status-badge ${statusClass}`}>{getGoalStatusText(goal.status)}</span>
                </p>
                {userId && ( // Кнопка редагування доступна, якщо є userId 
                  <button
                    onClick={() => handleEditGoalClick(goal)}
                    className="button-secondary"
                    style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
                    aria-label={`Редагувати ціль ${goal.goal_name}`}
                  >
                    Редагувати
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{userId ? "Цілі ще не додано." : "Завантаження цілей або потрібна авторизація..."}</p>
      )}
      

      <GoalForm
        newGoalData={newGoalData}
        handleGoalInputChange={handleGoalInputChange}
        handleSaveGoal={handleSaveGoal} 
        setShowGoalForm={setShowGoalForm}
        showGoalForm={showGoalForm}
        initialGoalData={initialGoalData}
        userId={userId} 
        setNewGoalData={setNewGoalData}
        isEditing={!!editingGoalId} 
      />
    </div>
  );
};

export default GoalsList;