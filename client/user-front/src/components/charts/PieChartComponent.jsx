// src/components/charts/PieChartComponent.js
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

const PieChartComponent = ({ data }) => {
  return (
    <div className="summary-box chart-container">
      <h3>Витрати за категоріями (за місяць)</h3>
      {data.length > 0 ? (
        <div className="pie-chart-container">
          <div className="pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value.toFixed(2)} грн`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p>Немає даних про витрати за категоріями за цей місяць.</p>
      )}
    </div>
  );
};

export default PieChartComponent;