// src/components/ui/SummaryBox.js
const SummaryBox = ({ summary, selectedMonth }) => {
  return (
    <>
      {summary && (
        <div className="summary-box">
          <h3>Загальний баланс</h3>
          <p>{((summary.income || 0) - (summary.expense || 0)).toFixed(2)} грн</p>
        </div>
      )}
      {summary && (
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
      )}
    </>
  );
};

export default SummaryBox;