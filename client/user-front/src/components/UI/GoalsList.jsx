// src/components/ui/GoalsList.js
import { formatDate, calculateProgress } from '../../utils/utils';

const GoalsList = ({ goals }) => {
  const getGoalStatusText = (status) => {
    switch (status) {
      case 'in_progress':
        return 'В процесі';
      case 'completed':
        return 'Завершена';
      case 'failed':
        return 'Невдала';
      default:
        return status || 'Невідомий';
    }
  };

  return (
    <div className="summary-box">
      <h3>Фінансові цілі</h3>
      {goals.length > 0 ? (
        <ul>
          {goals.map(goal => {
            const currentAmount = goal.current_amount !== undefined ? Number(goal.current_amount) : 0;
            const targetAmount = goal.target_amount !== undefined ? Number(goal.target_amount) : 0;
            const progress = calculateProgress(currentAmount, targetAmount);

            return (
              <li
                key={goal.id}
                className={`goal-item ${goal.status === 'completed' ? 'goal-completed' : (goal.status === 'failed' ? 'goal-failed' : 'goal-active')}`}
              >
                <p><strong>{goal.goal_name}</strong></p>
                {targetAmount > 0 && (
                  <>
                    <p>
                      Прогрес: {currentAmount.toFixed(2)} / {targetAmount.toFixed(2)} грн
                      ({progress.toFixed(1)}%)
                    </p>
                    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', height: '10px', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          width: `${progress}%`,
                          backgroundColor: goal.status === 'completed' ? '#4caf50' : (goal.status === 'failed' ? '#f44336' : '#2196f3'),
                          height: '100%',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease-in-out'
                        }}
                      ></div>
                    </div>
                  </>
                )}
                <p>Термін: {formatDate(goal.deadline)}</p>
                <p>Статус:
                  <span className={`status-badge ${
                    goal.status === 'in_progress' ? 'status-active' :
                    (goal.status === 'completed' ? 'status-completed' : 'status-failed')
                  }`}>
                    {getGoalStatusText(goal.status)}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Цілі ще не додано.</p>
      )}
    </div>
  );
};

export default GoalsList;