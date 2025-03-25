import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  transaction_date: string;

  @IsNotEmpty()
  created_at: string;
}

export class TransactionSummaryDto {
  income: number;
  expense: number;
}
