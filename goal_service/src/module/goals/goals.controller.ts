import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GoalsService } from './goals.service';
import { patterns } from '../patterns';
import { Transaction } from '../transactions/dto/transactions.dto';

@Injectable()
@Controller()
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}


@MessagePattern(patterns.GOAL.CREATE) 
async createGoal(goalData) {
  console.log('Received goal data:', goalData);  // Перевірка, чи приходять дані
  try {
    return this.goalsService.create(goalData);  // Викликаємо сервіс для створення цілі
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in createGoal service:', error.message);  
    } else {
      console.error('Unknown error in createGoal service:', error);  
    }
    throw error;  
  }
}


  // Обробка повідомлень для отримання цілей користувача
  @MessagePattern(patterns.GOAL.GET)
  async getUserGoals({ userId }) {
    return this.goalsService.findAll(userId);
  }

  // Обробка повідомлень для оновлення інформації про фінансову ціль
  @MessagePattern(patterns.GOAL.UPDATE)
  async updateGoal({ id, goalData }) {
    return this.goalsService.update(id, goalData);
  }

  // // Підписка на подію створення транзакції для оновлення поточної суми цілей
  // @MessagePattern(patterns.GOAL.GET_SUMMARY)
  // async onTransactionCreated(transaction: Transaction) {
  //   await this.goalsService.updateCurrentAmount(transaction.user_id);
  // }
}
