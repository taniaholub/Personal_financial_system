import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GoalsService } from './goals.service';
import { patterns } from '../patterns';
import { Transaction } from '../transactions/dto/transactions.dto';

@Injectable()
@Controller()
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // Обробка повідомлень для створення нової цілі
  @MessagePattern(patterns.GOAL.CREATE)
  async createGoal(goalData) {
    return this.goalsService.create(goalData);
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

  // Підписка на подію створення транзакції для оновлення поточної суми цілей
  @MessagePattern(patterns.GOAL.GET_SUMMARY)
  async onTransactionCreated(transaction: Transaction) {
    await this.goalsService.updateCurrentAmount(transaction.user_id);
  }
}
