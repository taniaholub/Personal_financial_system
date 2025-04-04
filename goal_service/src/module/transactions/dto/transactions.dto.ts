export interface Transaction {
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  transaction_date: Date;
  category?: string;
  description?: string;
}
