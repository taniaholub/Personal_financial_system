// src/components/forms/GoalForm.jsx
import React from 'react';

const GoalForm = ({
  newGoalData,
  handleGoalInputChange,
  handleSaveGoal, // Перейменовано для ясності, це буде обробник сабміту
  setShowGoalForm,
  showGoalForm,
  initialGoalData,
  userId,
  setNewGoalData,
  isEditing,
}) => {
  // console.log("[GoalForm] Props:", { showGoalForm, userId, isEditing, newGoalData });

  const getSafeInputValue = (value) => {
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return '';
    }
    // Для input type="date" потрібен формат YYYY-MM-DD
    if (typeof value === 'string' && value.includes('T')) {
      return value.split('T')[0];
    }
    return value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveGoal(); // Викликаємо функцію збереження/оновлення з GoalsList
  };

  if (!userId && showGoalForm) {
    // Якщо форма має показуватись, але немає userId, показуємо помилку
    // Це запобігає рендеру форми без ключової залежності
    return <p style={{ color: 'red', marginTop: '1rem' }}>Помилка: userId не визначено. Неможливо відобразити форму цілей.</p>;
  }

  return (
    <div className="summary-box" style={{ marginTop: '1rem' }}>
      <button
        onClick={() => {
          setShowGoalForm(prev => !prev);
          if (showGoalForm) { // Якщо форма закривається
            setNewGoalData(initialGoalData); // Скидаємо дані
          }
        }}
        className="button-secondary"
        style={{ width: '100%' }}
      >
        {showGoalForm ? 'Скасувати створення/редагування цілі' : 'Додати нову ціль'}
      </button>

      {showGoalForm && userId && ( // Рендеримо форму тільки якщо showGoalForm true І є userId
        <form
          onSubmit={handleSubmit}
          className="custom-form goal-form"
          style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}
        >
          <h4>{isEditing ? 'Редагувати фінансову ціль' : 'Додати нову фінансову ціль'}</h4>
          
          <div className="form-group">
            <label htmlFor="goal_name_input">Назва цілі:</label>
            <input
              type="text"
              id="goal_name_input"
              name="goal_name"
              className="input-field"
              value={getSafeInputValue(newGoalData.goal_name)}
              onChange={handleGoalInputChange}
              placeholder="Наприклад, Новий телефон"
              required
              aria-required="true"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="target_amount_input">Цільова сума (грн):</label>
            <input
              type="number"
              id="target_amount_input"
              name="target_amount"
              className="input-field"
              value={getSafeInputValue(newGoalData.target_amount)}
              onChange={handleGoalInputChange}
              step="0.01"
              min="0.01"
              placeholder="5000.00"
              required
              aria-required="true"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="current_amount_input">Поточна сума (грн):</label>
            <input
              type="number"
              id="current_amount_input"
              name="current_amount"
              className="input-field"
              value={getSafeInputValue(newGoalData.current_amount)}
              onChange={handleGoalInputChange}
              step="0.01"
              min="0"
              placeholder="0.00 (необов’язково)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal_deadline_input">Термін досягнення:</label>
            <input
              type="date"
              id="goal_deadline_input"
              name="deadline"
              className="input-field"
              value={getSafeInputValue(newGoalData.deadline)}
              onChange={handleGoalInputChange}
              min={new Date().toISOString().split("T")[0]} // Сьогоднішня дата як мінімум
              required
              aria-required="true"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="button-primary" style={{ flex: 1 }}>
              {isEditing ? 'Оновити ціль' : 'Зберегти ціль'}
            </button>
            <button
              type="button"
              className="button-secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setShowGoalForm(false);
                setNewGoalData(initialGoalData); // Скидаємо дані при скасуванні
              }}
            >
              Скасувати
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GoalForm;