export const patterns = {
  USER: {
    CREATE: { cmd: 'create_user' },
    FIND_ALL: { cmd: 'find_all_users' },
    FIND_BY_ID: { cmd: 'find_user_by_id' },
    UPDATE: { cmd: 'update_user' },
    DELETE: { cmd: 'delete_user' },
    FIND_BY_EMAIL: { cmd: 'find_user_by_email' },
    RESET_PASSWORD: { cmd: 'reset_password' },
    LOGIN: { cmd: 'login' },
  },
  TRANSACTION: {
    CREATE: 'create_transaction',
    GET: 'get_transactions',
    GET_SUMMARY: 'get_transaction_summary',
    GET_MONTHLY_STATS: 'transaction_get_monthly_stats',
  },
  GOAL: {
    CREATE: 'create_goal',  
    GET: 'get_goals',
    UPDATE: 'update_goal',
    GET_SUMMARY: 'get_goal_summary',
  },
};
