iconst GoalForm = ({
  newGoalData,
  handleGoalInputChange,
  handleAddGoal,
  setShowGoalForm,
  showGoalForm,
  initialGoalData,
  userId,
  setNewGoalData, 
}) => {
  // Функція для безпечного отримання значення для інпуту
  // Гарантує, що значення не буде undefined
  const getSafeInputValue = (value) => {
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return ''; // Повертаємо порожній рядок для null, undefined, NaN
    }
    return value; // В іншому випадку повертаємо саме значення
  };

  return (
    <div className="summary-box">
      <button
        onClick={() => setShowGoalForm(prev => !prev)}
        className="button-secondary"
        style={{ marginTop: '1rem', width: '100%' }} 
      >
        {showGoalForm ? 'Скасувати додавання цілі' : 'Додати нову ціль'}
      </button>

      {showGoalForm && userId && ( // Перевіряємо і userId, щоб уникнути рендерингу форми без користувача
        <form
          onSubmit={handleAddGoal}
          className="form-container goal-form" 
          style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}
        >
          <h4>Додати нову фінансову ціль</h4>
          
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
              min="0.01" // Цільова сума має бути позитивною
              placeholder="5000.00"
              required
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
              min="0" // Поточна сума може бути 0 або більше
              placeholder="0.00 (необов'язково)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal_deadline_input">Термін досягнення:</label>
            <input
              type="date"
              id="goal_deadline_input"
              name="deadline"
              className="input-field"
              value={getSafeInputValue(newGoalData.deadline)} // input type="date" очікує рядок YYYY-MM-DD
              onChange={handleGoalInputChange}
              min={new Date().toISOString().split("T")[0]} // Мінімальна дата - сьогодні
              required
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}> {}
            <button type="submit" className="button-primary" style={{ flex: 1 }}>
              Зберегти ціль
            </button>
            <button
              type="button"
              className="button-secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setShowGoalForm(false);
                // Скидаємо форму до початкових значень
                if (setNewGoalData && initialGoalData) {
                  setNewGoalData(initialGoalData);
                }
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