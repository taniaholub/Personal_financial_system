// src/components/ui/MonthSelector.js
const MonthSelector = ({ selectedMonth, setSelectedMonth }) => {
  const generateMonthOptions = () => {
    const options = [];
    const startDate = new Date(2023, 0, 1);
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
  );
};

export default MonthSelector;