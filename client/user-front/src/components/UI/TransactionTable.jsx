// src/components/ui/TransactionTable.js
const TransactionTable = ({ transactions, filterType, setFilterType, filterCategory, setFilterCategory, uniqueCategories }) => {
  return (
    <div className="summary-box">
      <h3>Всі транзакції за місяць</h3>
      <div className="filter-container">
        <div>
          <label htmlFor="filter-type" className="filter-label">Тип:</label>
          <select
            id="filter-type"
            className="input-field filter-type-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Всі типи</option>
            <option value="income">Доходи</option>
            <option value="expense">Витрати</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-category" className="filter-label">Категорія:</label>
          <select
            id="filter-category"
            className="input-field filter-category-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            disabled={uniqueCategories.length === 0}
          >
            <option value="all">Всі категорії</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="transaction-table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип</th>
                <th>Категорія</th>
                <th>Сума</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id || `${tx.transaction_date}-${tx.amount}-${tx.type}-${tx.category}`}>
                  <td>{tx.transaction_date ? new Date(tx.transaction_date).toLocaleDateString('uk-UA') : '-'}</td>
                  <td className={tx.type === 'income' ? 'type-income' : 'type-expense'}>
                    {tx.type === 'income' ? 'Дохід' : 'Витрата'}
                  </td>
                  <td>{tx.category || '-'}</td>
                  <td>{parseFloat(tx.amount).toFixed(2)} грн</td>
                  <td>{tx.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Немає транзакцій для відображення за обраними фільтрами.</p>
      )}
    </div>
  );
};

export default TransactionTable;