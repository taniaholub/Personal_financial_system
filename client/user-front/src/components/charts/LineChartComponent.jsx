// src/components/charts/LineChartComponent.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => {
  return (
    <div className="summary-box chart-container">
      <h3>Динаміка доходів та витрат (по днях)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#00C49F" name="Доходи" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Витрати" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Недостатньо даних для відображення графіку.</p>
      )}
    </div>
  );
};

export default LineChartComponent;