import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchWithAuth, getTokenPayload } from "../api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import '.././index.css';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

function ProfilePage() {
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [historyData, setHistoryData] = useState([]); // Дані для графіку доходів/витрат по днях
  const [categoryChartData, setCategoryChartData] = useState([]); // Дані для кругової діаграми витрат
  const [allTransactionsForMonth, setAllTransactionsForMonth] = useState([]); // Усі транзакції за місяць
  const [showForm, setShowForm] = useState(false); // Керування відображенням форми
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Поточний місяць (YYYY-MM)
  const [goals, setGoals] = useState([
    { id: 1, name: "Квартира", status: "active" },
    { id: 2, name: "Телефон", status: "completed" }
  ]); // Список фінансових цілей

  // Стани для фільтрів транзакцій
  const [filterType, setFilterType] = useState('all'); // Фільтр за типом (усі, доходи, витрати)
  const [filterCategory, setFilterCategory] = useState('all'); // Фільтр за категорією

  // Початкові дані для нової транзакції
  const initialTransactionData = {
    amount: '',
    category: '',
    description: '',
    type: 'expense',
    transaction_date: new Date().toISOString().slice(0, 10),
  };
  const [newTransactionData, setNewTransactionData] = useState(initialTransactionData);

  // Отримання ID користувача з JWT-токена
  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload || !payload.memberId) return;
    setUserId(payload.memberId); // Збереження ID користувача
  }, []);

  // Функція для отримання всіх даних сторінки
  const fetchPageData = useCallback(async () => {
    if (!userId) return;

    try {
      // Отримання загального зведення транзакцій
      const summaryRes = await fetchWithAuth(`/transactions/${userId}/summary`);
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Отримання транзакцій за вибраний місяць
      const transactionsRes = await fetchWithAuth(`/transactions/${userId}?month=${selectedMonth}`);
      const transactionsData = await transactionsRes.json();
      
      // Сортування транзакцій за датою (від новіших до старіших)
      const sortedTransactions = [...transactionsData].sort((a, b) =>
        new Date(b.transaction_date) - new Date(a.transaction_date)
      );
      setAllTransactionsForMonth(sortedTransactions);

      // Формування даних для лінійного графіку (щоденні доходи/витрати)
      const dailyData = {};
      sortedTransactions.forEach(tx => {
        const date = new Date(tx.transaction_date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
        if (!dailyData[date]) {
          dailyData[date] = { date, income: 0, expense: 0, fullDate: new Date(tx.transaction_date) };
        }
        if (tx.type === 'income') {
          dailyData[date].income += Number(tx.amount);
        } else {
          dailyData[date].expense += Number(tx.amount);
        }
      });
      setHistoryData(Object.values(dailyData).sort((a, b) => a.fullDate - b.fullDate));

      // Формування даних для кругової діаграми (витрати за категоріями)
      const expenseCategoryMap = {};
      transactionsData.forEach(tx => {
        if (tx.type === 'expense' && tx.category) {
          expenseCategoryMap[tx.category] = (expenseCategoryMap[tx.category] || 0) + Number(tx.amount);
        }
      });
      const formattedExpenseCategories = Object.entries(expenseCategoryMap).map(([name, value]) => ({
        name,
        value
      }));
      setCategoryChartData(formattedExpenseCategories);

      // Отримання місячного зведення
      const monthlySummaryRes = await fetchWithAuth(`/transactions/${userId}/summary?month=${selectedMonth}`);
      const monthlySummaryData = await monthlySummaryRes.json();
      setSummary(prev => ({ ...prev, ...monthlySummaryData }));
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
  }, [userId, selectedMonth]);

  useEffect(() => {
    fetchPageData(); // Виклик функції отримання даних при зміні userId або selectedMonth
  }, [fetchPageData]);

  // Отримання унікальних категорій з транзакцій
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    allTransactionsForMonth.forEach(tx => {
      if (tx.category) {
        categories.add(tx.category);
      }
    });
    return Array.from(categories).sort();
  }, [allTransactionsForMonth]);

  // Фільтрація транзакцій для відображення
  const filteredTransactions = useMemo(() => {
    return allTransactionsForMonth.filter(tx => {
      const typeMatch = filterType === 'all' || tx.type === filterType;
      const categoryMatch = filterCategory === 'all' || tx.category === filterCategory;
      return typeMatch && categoryMatch;
    });
  }, [allTransactionsForMonth, filterType, filterCategory]);

  // Обробник зміни полів форми
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransactionData(prev => ({ ...prev, [name]: value }));
  };

  // Обробник додавання нової транзакції
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Не знайдено ID користувача. Будь ласка, увійдіть знову.");
      return;
    }

    // Перевірка коректності суми
    if (!newTransactionData.amount || isNaN(parseFloat(newTransactionData.amount)) || parseFloat(newTransactionData.amount) <= 0) {
      alert("Будь ласка, введіть коректну суму.");
      return;
    }
    if (!newTransactionData.transaction_date) {
      alert("Будь ласка, оберіть дату.");
      return;
    }

    // Формування даних для запиту
    const payload = {
      user_id: userId,
      amount: parseFloat(newTransactionData.amount),
      type: newTransactionData.type,
      transaction_date: newTransactionData.transaction_date,
    };
    if (newTransactionData.category && newTransactionData.category.trim() !== "") {
      payload.category = newTransactionData.category.trim();
    }
    if (newTransactionData.description && newTransactionData.description.trim() !== "") {
      payload.description = newTransactionData.description.trim();
    }

    try {
      // Відправлення запиту на додавання транзакції
      const response = await fetchWithAuth('/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не вдалося додати транзакцію');
      }

      setNewTransactionData(initialTransactionData); // Скидання форми
      setShowForm(false); // Приховування форми
      alert('Транзакцію успішно додано!');
      fetchPageData(); // Оновлення даних сторінки
    } catch (error) {
      console.error("Помилка при додаванні транзакції:", error);
      alert(`Помилка: ${error.message}`);
    }
  };

  // Генерація списку місяців для вибору
  const generateMonthOptions = () => {
    const options = [];
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date();
    let currentDate = new Date(endDate);

    while (currentDate >= startDate) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const value = `${year}-${month}`;
      const label = currentDate.toLocaleString('uk-UA', { month: 'long', year: 'numeric' });
      options.push({ value, label });
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    return options;
  };

  return (
    <div className="dashboard">
      <h2>Профіль користувача</h2>
      <div>
        <label htmlFor="month-select">Оберіть місяць: </label>
        <select
          id="month-select"
          className="input-field"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {generateMonthOptions().map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="flex-container">
        <div className="left-panel">
          {summary && (
            <div className="summary-box">
              <h3>Загальний баланс</h3>
              <p>{(summary.income - summary.expense).toFixed(2)} грн</p>
            </div>
          )}
          <div className="summary-box">
            <h3>Доходи та витрати за місяць ({new Date(selectedMonth + '-01').toLocaleString('uk-UA', { month: 'long', year: 'numeric' })})</h3>
            <table>
              <thead>
                <tr>
                  <th>Тип</th>
                  <th>Сума</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Доходи</td>
                  <td>{(summary?.monthlyIncome || 0).toFixed(2)} грн</td>
                </tr>
                <tr>
                  <td>Витрати</td>
                  <td>{(summary?.monthlyExpense || 0).toFixed(2)} грн</td>
                </tr>
              </tbody>
            </table>
          </div>

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

            {filteredTransactions.length > 0 ? (
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
                    {filteredTransactions.map((tx) => ( 
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

          <div className="summary-box">
            <button onClick={() => setShowForm(prev => !prev)} className="button-primary">
              {showForm ? 'Скасувати' : 'Додати транзакцію'}
            </button>
            {showForm && (
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  >
                    <option value="expense">Витрата</option>
                    <option value="income">Дохід</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Категорія {newTransactionData.type === 'expense' ? '(обов\'язково для витрат)' : ''}:</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Напр. Їжа, Транспорт, Зарплата"
                    className="input-field"
                    value={newTransactionData.category}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Опис (необов\'язково):</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Додаткова інформація"
                    className="input-field"
                    value={newTransactionData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <button type="submit" className="button-primary">Зберегти транзакцію</button>
              </form>
            )}
          </div>

          <div className="summary-box chart-container">
            <h3>Динаміка доходів та витрат (по днях)</h3>
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#00C49F" name="Доходи" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Витрати" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (<p>Недостатньо даних для відображення графіку.</p>)}
          </div>

          <div className="summary-box chart-container">
            <h3>Витрати за категоріями (за місяць)</h3>
            {categoryChartData.length > 0 ? (
              <div className="pie-chart-container">
                <div className="pie-chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value.toFixed(2)} грн`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (<p>Немає даних про витрати за категоріями за цей місяць.</p>)}
          </div>
        </div>

        <div className="right-panel">
          <div className="summary-box">
            <h3>Фінансові цілі</h3>
            {goals.length > 0 ? (
              <ul>
                {goals.map(goal => (
                  <li key={goal.id} className={`goal-item ${goal.status === 'active' ? 'goal-active' : 'goal-completed'}`}>
                    <p><strong>{goal.name}</strong></p>
                    <p>Статус:
                      <span className={`status-badge ${goal.status === 'active' ? 'status-active' : 'status-completed'}`}>
                        {goal.status === 'active' ? 'Активна' : 'Завершена'}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : <p>Цілі ще не додано.</p>}
            <button className="button-secondary">Додати ціль</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;