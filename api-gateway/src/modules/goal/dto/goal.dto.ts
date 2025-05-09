import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  goal_name: string;

  @IsNotEmpty()
  @IsNumber()
  target_amount: number;

  @IsNotEmpty()
  @IsNumber()
  current_amount: number;

  @IsNotEmpty()
  transaction_date: string;

  @IsNotEmpty()
  created_at: string;

  @IsNotEmpty()
  @IsEnum(['in_progress', 'completed', 'failed'])
  status: 'in_progress' | 'completed' | 'failed';
}

export class GoalSummaryDto {
  in_progress: number;
  completed: number;
  failed: number;
}
