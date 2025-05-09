// goal_service/dto/transaction-event.dto.ts
export class TransactionEventDto {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  transaction_date: Date | string; // Залежить від того, як серіалізується дата
}