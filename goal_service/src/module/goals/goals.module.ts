import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../../entity/goal.entity';
import { GoalsService } from './goals.service';
import { Transaction } from '../transactions/entity/transaction.entity';
import { TransactionsModule } from '../transactions/transactions.module'; // Імпорт модуля транзакцій

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, Transaction]),
    TransactionsModule, // Додайте цей рядок для імпорту транзакційного модуля
  ],
  providers: [GoalsService],
})
export class GoalsModule {}
