import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../../entity/goal.entity';
import { GoalsService } from './goals.service';
import { Transaction } from '../transactions/entity/transaction.entity';
import { TransactionsModule } from '../transactions/transactions.module'; // Імпорт модуля транзакцій
import { GoalsController } from './goals.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Goal, Transaction])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}