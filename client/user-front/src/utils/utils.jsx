// src/utils/utils.js
export const formatDate = (dateString) => {
  if (!dateString) return 'не встановлено';
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) return 'некоректна дата';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('uk-UA', options);
};

export const calculateProgress = (current, target) => {
  if (target <= 0 || current === undefined || target === undefined) return 0;
  const progress = (Number(current) / Number(target)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};