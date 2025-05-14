// api-gateway/src/modules/goal/dto/goal.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString } from 'class-validator';

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
  @IsDateString({}, { message: 'Deadline must be a valid ISO 8601 date string (e.g., YYYY-MM-DD)' }) 
  deadline: string; // Очікуємо рядок дати, наприклад "YYYY-MM-DD" або повний ISO

  // created_at прибрали, БД встановлює його автоматично

  @IsNotEmpty()
  @IsEnum(['in_progress', 'completed', 'failed'], { message: 'Status must be one of: in_progress, completed, failed' })
  status: 'in_progress' | 'completed' | 'failed';
}

// GoalSummaryDto залишається без змін, якщо він використовується
export class GoalSummaryDto {
  in_progress: number;
  completed: number;
  failed: number;
}