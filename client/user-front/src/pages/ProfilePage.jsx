import React, { useEffect, useState } from "react";
import { fetchWithAuth, getTokenPayload } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import '.././index.css';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

function ProfilePage() {
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState([
    { id: 1, name: "Квартира", status: "active" },
    { id: 2, name: "Телефон", status: "completed" }
  ]);

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload || !payload.memberId) return;
    setUserId(payload.memberId);
  }, []);

  useEffect(() => {
    if (!userId) return;
  
    fetchWithAuth(`/transactions/${userId}/summary`)
      .then(res => res.json())
      .then(data => setSummary(data));
  
    fetchWithAuth(`/transactions/${userId}`)
      .then(res => res.json())
      .then(data => {
        const sortedTransactions = data.sort((a, b) => 
          new Date(b.transaction_date) - new Date(a.transaction_date)
        );
        setTransactions(sortedTransactions);

        // Дані для лінійного графіку по днях
        const dailyData = {};
        sortedTransactions.forEach(tx => {
          const date = new Date(tx.transaction_date).toLocaleDateString();
          if (!dailyData[date]) {
            dailyData[date] = { date, income: 0, expense: 0 };
          }
          if (tx.type === 'income') {
            dailyData[date].income += Number(tx.amount);
          } else {
            dailyData[date].expense += Number(tx.amount);
          }
        });
        // Сортування за датами від найменшої до найбільшої
        setHistoryData(Object.values(dailyData).sort((a, b) => 
          new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-'))
        ));

        // Дані для кругової діаграми
        const categoryMap = {};
        data.forEach(tx => {
          if (tx.type === 'expense') {
            categoryMap[tx.category] = (categoryMap[tx.category] || 0) + Number(tx.amount);
          }
        });
        const formatted = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value
        }));
        setCategoryData(formatted);
      });
  }, [userId]);
  
  return (
    <div className="dashboard">
      <h2>Профіль користувача</h2>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* LEFT SIDE */}
        <div style={{ flex: 3 }}>
          {summary && (
            <div className="summary-box">
              <h3>Загальний баланс</h3>
              <p>{summary.income - summary.expense} грн</p>
            </div>
          )}

          <div className="summary-box">
            <h3>Доходи та витрати за місяць</h3>
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
                  <td>{summary?.income} грн</td>
                </tr>
                <tr>
                  <td>Витрати</td>
                  <td>{summary?.expense} грн</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary-box">
            <h3>Всі транзакції за місяць</h3>
            {transactions.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Тип</th>
                      <th>Категорія</th>
                      <th>Сума</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={tx.id || index}>
                        <td>{tx.transaction_date ? new Date(tx.transaction_date).toLocaleDateString() : '-'}</td>
                        <td style={{ color: tx.type === 'income' ? 'green' : 'red' }}>
                          {tx.type === 'income' ? 'Дохід' : 'Витрата'}
                        </td>
                        <td>{tx.category || '-'}</td>
                        <td>{parseFloat(tx.amount).toFixed(2)} грн</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Немає транзакцій для відображення</p>
            )}
          </div>

          <div className="summary-box">
            <button onClick={() => setShowForm(prev => !prev)}>Додати</button>
            {showForm && (
              <div className="form-group">
                <input type="number" placeholder="Сума" className="input-field" />
                <input type="text" placeholder="Категорія" className="input-field" />
                <input type="text" placeholder="Опис" className="input-field" />
                <select className="input-field">
                  <option value="income">Доходи</option>
                  <option value="expense">Витрати</option>
                  <option value="description">Опис</option>
                </select>
                <button>Зберегти</button>
              </div>
            )}
          </div>

          <div className="summary-box" style={{ gap: '2rem', padding:'2rem'}}>
            <h3>Динаміка доходів та витрат (по днях)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00C49F" name="Доходи" dot={true} />
                <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Витрати" dot={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="summary-box" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '60%' }}>
              <h3>Витрати за категоріями</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value.toFixed(2)} грн`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value.toFixed(2)} грн`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categoryData.map((entry, index) => (
                <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 14, height: 14, backgroundColor: COLORS[index % COLORS.length], display: 'inline-block', borderRadius: '50%' }}></span>
                  {entry.name}: {entry.value.toFixed(2)} грн
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="summary-box">
            <h3>Фінансові цілі</h3>
            <ul>
              {goals.map(goal => (
                <li key={goal.id} style={{ marginBottom: '1rem' }}>
                  <p><strong>{goal.name}</strong></p>
                  <p>Статус: {goal.status === 'active' ? 'Активна' : 'Завершена'}</p>
                </li>
              ))}
            </ul>
            <button>Додати ціль</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;