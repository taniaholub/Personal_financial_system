import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Goal } from '../../entity/goal.entity';
import { Transaction } from '../transactions/entity/transaction.entity';

import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectConnection() private connection: Connection,
  ) {}

  // Створення фінансової цілі
  create(goalData: Partial<Goal>) {
    return this.goalRepository.save(goalData);
  }

  // Отримання списку фінансових цілей користувача
  findAll(userId: string) {
    return this.goalRepository.find({ where: { user_id: userId } });
  }

  // Оновлення інформації про фінансову ціль
  async update(id: string, goalData: Partial<Goal>) {
    await this.goalRepository.update(id, goalData);
    return this.goalRepository.findOne({ where: { id } });
  }

  // Оновлення поточної суми зібраних коштів на основі транзакцій
  async updateCurrentAmount(userId: string) {
    const goals = await this.goalRepository.find({
      where: { user_id: userId },
    });

    for (const goal of goals) {
      const transactions = await this.transactionRepository.find({
        where: {
          user_id: userId,
          type: 'income',
          transaction_date: LessThanOrEqual(goal.deadline),
        },
      });

      goal.current_amount = transactions.reduce(
        (acc, transaction) => acc + Number(transaction.amount),
        0,
      );
      await this.goalRepository.save(goal);
    }
  }
}
