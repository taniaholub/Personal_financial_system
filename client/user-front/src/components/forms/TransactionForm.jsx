// src/components/forms/TransactionForm.jsx
const TransactionForm = ({
  newTransactionData,
  handleTransactionInputChange,
  handleAddTransaction,
  setShowTransactionForm,
  initialTransactionData,
  showTransactionForm, // Додаємо showTransactionForm до пропсів
}) => {
  return (
    <div className="summary-box">
      <button
        onClick={() => setShowTransactionForm(prev => !prev)}
        className="button-primary"
      >
        {showTransactionForm ? 'Скасувати транзакцію' : 'Додати транзакцію'}
      </button>
      {showTransactionForm && (
        <form onSubmit={handleAddTransaction} className="form-container">
          <div className="form-group">
            <label htmlFor="amount">Сума:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.00"
              className="input-field"
              value={newTransactionData.amount}
              onChange={handleTransactionInputChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Тип:</label>
            <select
              id="type"
              name="type"
              className="input-field"
              value={newTransactionData.type}
              onChange={handleTransactionInputChange}
              required
            >
              <option value="expense">Витрата</option>
              <option value="income">Дохід</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Категорія {newTransactionData.type === 'expense' ? '(опціонально для витрат)' : ''}:</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Напр. Їжа, Транспорт, Зарплата"
              className="input-field"
              value={newTransactionData.category}
              onChange={handleTransactionInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="transaction_date">Дата:</label>
            <input
              type="date"
              id="transaction_date"
              name="transaction_date"
              className="input-field"
              value={newTransactionData.transaction_date}
              onChange={handleTransactionInputChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Опис (необов’язково):</label>
            <textarea
              id="description"
              name="description"
              placeholder="Додаткова інформація"
              className="input-field"
              value={newTransactionData.description}
              onChange={handleTransactionInputChange}
              rows="3"
            />
          </div>
          <button type="submit" className="button-primary">Зберегти транзакцію</button>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;