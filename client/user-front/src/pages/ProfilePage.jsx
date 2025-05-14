// src/pages/ProfilePage.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchWithAuth, getTokenPayload } from "../api";
import SummaryBox from "../components/UI/SummaryBox";
import TransactionTable from "../components/UI/TransactionTable";
import GoalsList from "../components/UI/GoalsList";
import MonthSelector from "../components/UI/MonthSelector";
import TransactionForm from "../components/forms/TransactionForm";
import GoalForm from "../components/forms/GoalForm";
import LineChartComponent from "../components/charts/LineChartComponent";
import PieChartComponent from "../components/charts/PieChartComponent";
import '../index.css';

function ProfilePage() {
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [allTransactionsForMonth, setAllTransactionsForMonth] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [goals, setGoals] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const initialTransactionData = {
    amount: '',
    category: '',
    description: '',
    type: 'expense',
    transaction_date: new Date().toISOString().slice(0, 10),
  };
  const [newTransactionData, setNewTransactionData] = useState(initialTransactionData);

  const initialGoalData = {
    goal_name: '',
    target_amount: '',
    deadline: new Date().toISOString().slice(0, 10),
  };
  const [newGoalData, setNewGoalData] = useState(initialGoalData);
  const [showGoalForm, setShowGoalForm] = useState(false);

  useEffect(() => {
    const payload = getTokenPayload();
    if (payload?.memberId) {
      setUserId(payload.memberId);
    } else {
      console.error("User not authenticated or memberId not found in token.");
    }
  }, []);

  const fetchGoals = useCallback(async () => {
    if (!userId) return;

    const currentAccessToken = localStorage.getItem('access_token');
    if (!currentAccessToken) {
      console.error("No access token found in localStorage.");
      return;
    }

    try {
      const API_BASE_URL = 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/goals/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Не вдалося завантажити цілі: ${response.status} ${response.statusText}`, errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setGoals(data);
      } else {
        setGoals([]);
      }

    } catch (error) {
      console.error("Помилка при завантаженні цілей:", error);
      setGoals([]);
    }
  }, [userId]);

  const fetchPageData = useCallback(async () => {
    if (!userId) return;
    try {
      const summaryRes = await fetchWithAuth(`/transactions/${userId}/summary`);
      const summaryDataOverall = await summaryRes.json();

      const transactionsRes = await fetchWithAuth(`/transactions/${userId}?month=${selectedMonth}`);
      const transactionsData = await transactionsRes.json();

      const sortedTransactions = [...transactionsData].sort((a, b) =>
        new Date(b.transaction_date) - new Date(a.transaction_date)
      );
      setAllTransactionsForMonth(sortedTransactions);

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
      setHistoryData(Object.values(dailyData).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate)));

      const expenseCategoryMap = {};
      transactionsData.forEach(tx => {
        if (tx.type === 'expense' && tx.category) {
          expenseCategoryMap[tx.category] = (expenseCategoryMap[tx.category] || 0) + Number(tx.amount);
        }
      });
      const formattedExpenseCategories = Object.entries(expenseCategoryMap).map(([name, value]) => ({ name, value }));
      setCategoryChartData(formattedExpenseCategories);

      const monthlySummaryRes = await fetchWithAuth(`/transactions/${userId}/summary?month=${selectedMonth}`);
      const monthlySummaryData = await monthlySummaryRes.json();

      setSummary({
        income: summaryDataOverall.income,
        expense: summaryDataOverall.expense,
        monthlyIncome: monthlySummaryData.monthlyIncome,
        monthlyExpense: monthlySummaryData.monthlyExpense,
      });
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
  }, [userId, selectedMonth]);

  useEffect(() => {
    if (userId) {
      fetchPageData();
    }
  }, [userId, selectedMonth, fetchPageData]);

  useEffect(() => {
    if (userId) {
      fetchGoals();
      const intervalId = setInterval(() => {
        fetchGoals();
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [userId, fetchGoals]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    allTransactionsForMonth.forEach(tx => {
      if (tx.category) {
        categories.add(tx.category);
      }
    });
    return Array.from(categories).sort();
  }, [allTransactionsForMonth]);

  const filteredTransactions = useMemo(() => {
    return allTransactionsForMonth.filter(tx => {
      const typeMatch = filterType === 'all' || tx.type === filterType;
      const categoryMatch = filterCategory === 'all' || tx.category === filterCategory;
      return typeMatch && categoryMatch;
    });
  }, [allTransactionsForMonth, filterType, filterCategory]);
  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransactionData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Не знайдено ID користувача. Будь ласка, увійдіть знову.");
      return;
    }
    if (!newTransactionData.amount || isNaN(parseFloat(newTransactionData.amount)) || parseFloat(newTransactionData.amount) <= 0) {
      alert("Будь ласка, введіть коректну суму.");
      return;
    }
    if (!newTransactionData.transaction_date) {
      alert("Будь ласка, оберіть дату.");
      return;
    }
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
      const response = await fetchWithAuth('/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
        throw new Error(errorData.message || `Не вдалося додати транзакцію: ${response.statusText}`);
      }
      setNewTransactionData(initialTransactionData);
      setShowTransactionForm(false);
      alert('Транзакцію успішно додано!');
      fetchPageData(); // Оновити дані сторінки
      // fetchGoals(); // Якщо транзакції впливають на цілі (наприклад, current_amount), то потрібно оновити
    } catch (error) {
      console.error("Помилка при додаванні транзакції:", error);
      alert(`Помилка: ${error.message}`);
    }
  };

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoalData(prev => ({ ...prev, [name]: value }));
  };


const handleAddGoal = async (e) => {
  e.preventDefault();

  const currentAmount = (newGoalData.current_amount && !isNaN(parseFloat(newGoalData.current_amount)))
                        ? parseFloat(newGoalData.current_amount)
                        : 0;

  if (currentAmount > parseFloat(newGoalData.target_amount)) {
    alert("Поточна сума не може бути більшою за цільову суму.");
    return;
  }

  const payload = {
    user_id: userId,
    goal_name: newGoalData.goal_name.trim(),
    target_amount: parseFloat(newGoalData.target_amount),
    current_amount: currentAmount,
    deadline: newGoalData.deadline,
    status: 'in_progress',
  };

  try {
    const response = await fetchWithAuth('/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(errorData.message || `Не вдалося додати ціль: ${response.statusText}`);
    }

    setNewGoalData(initialGoalData);
    setShowGoalForm(false);
    alert('Ціль успішно додано!');
    fetchGoals(); // Оновлюємо список цілей
  } catch (error) {
    console.error("Помилка при додаванні цілі:", error);
    alert(`Помилка: ${error.message}`);
  }
};


  return (
    <div className="dashboard">
      <h2>Профіль користувача</h2>
      <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <div className="flex-container">
        <div className="left-panel">
          <SummaryBox summary={summary} selectedMonth={selectedMonth} />
          <TransactionTable
            transactions={filteredTransactions}
            filterType={filterType}
            setFilterType={setFilterType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            uniqueCategories={uniqueCategories}
          />
          <TransactionForm
            newTransactionData={newTransactionData}
            setNewTransactionData={setNewTransactionData} // Передаємо setNewTransactionData
            handleTransactionInputChange={handleTransactionInputChange}
            handleAddTransaction={handleAddTransaction}
            setShowTransactionForm={setShowTransactionForm}
            showTransactionForm={showTransactionForm}
            initialTransactionData={initialTransactionData}
          />
          <LineChartComponent data={historyData} />
          <PieChartComponent data={categoryChartData} />
        </div>
        <div className="right-panel">
          <GoalsList goals={goals} />
          <GoalForm
            newGoalData={newGoalData}
            setNewGoalData={setNewGoalData} // Передаємо setNewGoalData
            handleGoalInputChange={handleGoalInputChange}
            handleAddGoal={handleAddGoal}
            setShowGoalForm={setShowGoalForm}
            showGoalForm={showGoalForm}
            initialGoalData={initialGoalData}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;