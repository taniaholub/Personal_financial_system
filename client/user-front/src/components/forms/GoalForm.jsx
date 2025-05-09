// src/components/forms/GoalForm.jsx
const GoalForm = ({
  newGoalData,
  handleGoalInputChange,
  handleAddGoal,
  setShowGoalForm,
  showGoalForm, // Додаємо showGoalForm
  initialGoalData,
  userId,
  setNewGoalData, // Додаємо setNewGoalData
}) => {
  return (
    <div className="summary-box">
      <button
        onClick={() => setShowGoalForm(prev => !prev)}
        className="button-secondary"
        style={{ marginTop: '1rem' }}
      >
        {showGoalForm ? 'Скасувати додавання цілі' : 'Додати нову ціль'}
      </button>
      {showGoalForm && userId && (
        <form
          onSubmit={handleAddGoal}
          className="form-container"
          style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}
        >
          <h4>Додати нову ціль</h4>
          <div className="form-group">
            <label htmlFor="goal_name_input">Назва цілі:</label>
            <input
              type="text"
              id="goal_name_input"
              name="goal_name"
              className="input-field"
              value={newGoalData.goal_name}
              onChange={handleGoalInputChange}
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
              value={newGoalData.target_amount}
              onChange={handleGoalInputChange}
              step="0.01"
              min="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="goal_deadline_input">Термін досягнення:</label>
            <input
              type="date"
              id="goal_deadline_input"
              name="deadline"
              className="input-field"
              value={newGoalData.deadline}
              onChange={handleGoalInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="button-primary">Зберегти ціль</button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setShowGoalForm(false);
                setNewGoalData(initialGoalData); // Використовуємо setNewGoalData
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