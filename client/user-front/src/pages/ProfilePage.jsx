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
  const [error, setError] = useState(null);

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload || !payload.memberId) {
      setError("Invalid token");
      return;
    }
    setUserId(payload.memberId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchWithAuth(`/transactions/${userId}/summary`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(() => setError("Не вдалося завантажити зведену інформацію"));

    fetchWithAuth(`/transactions/${userId}/monthly`)
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(() => setHistoryData([]));

    fetchWithAuth(`/transactions/${userId}`)
      .then(res => res.json())
      .then(data => {
        const categoryMap = {};
        data.forEach(tx => {
          if (tx.type === 'expense') {
            categoryMap[tx.category] = (categoryMap[tx.category] || 0) + Number(tx.amount);
          }
        });
        const formatted = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
        setCategoryData(formatted);
      })
      .catch(() => setCategoryData([]));
  }, [userId]);

  return (
    <div className="dashboard p-6">
      <h2 className="text-2xl font-semibold mb-4">Профіль користувача</h2>

      {error && <p className="text-red-500">{error}</p>}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-medium">Баланс</h3>
            <p className="text-lg font-bold">{summary.income - summary.expense} грн</p>
          </div>
          <div className="bg-green-100 rounded-xl p-4 shadow">
            <h3 className="font-medium">Доходи (місяць)</h3>
            <p className="text-lg font-bold">{summary.income} грн</p>
          </div>
          <div className="bg-red-100 rounded-xl p-4 shadow">
            <h3 className="font-medium">Витрати (місяць)</h3>
            <p className="text-lg font-bold">{summary.expense} грн</p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Динаміка доходів та витрат</h3>
        {historyData.length === 0 ? (
          <p>Немає даних</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#00C49F" name="Доходи" />
              <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Витрати" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Витрати за категоріями</h3>
        {categoryData.length === 0 ? (
          <p>Немає витрат для відображення</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;