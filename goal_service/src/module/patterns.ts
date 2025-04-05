export const patterns = {
  GOAL: {
    CREATE: 'create_goal',  // Переконайтесь, що це збігається в обох мікросервісах
    GET: 'get_goals',
    UPDATE: 'update_goal',
    GET_SUMMARY: 'get_goal_summary',
  },
  TRANSACTION: {
    CREATE: 'create_transaction',
    GET: 'get_transactions',
    GET_SUMMARY: 'get_transaction_summary',
  },
};
