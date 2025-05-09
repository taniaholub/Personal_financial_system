// src/components/ui/TransactionFilters.js
const TransactionFilters = ({ filterType, setFilterType, filterCategory, setFilterCategory, uniqueCategories }) => {
  return (
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
  );
};

export default TransactionFilters;