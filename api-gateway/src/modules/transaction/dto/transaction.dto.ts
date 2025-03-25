// transaction.dto.ts
import { IsString, IsUUID, IsNumber, IsEnum, IsOptional, IsDate } from 'class-validator';

export class TransactionDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  @IsOptional()
  transaction_date?: Date;

  @IsDate()
  @IsOptional()
  created_at?: Date;
}
