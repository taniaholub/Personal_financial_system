import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { patterns } from '../patterns';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(patterns.TRANSACTION.CREATE)
  async createTransaction(transactionData) {
    return this.transactionsService.create(transactionData);
  }

  @MessagePattern(patterns.TRANSACTION.GET)
  async getUserTransactions({ userId }) {
    return this.transactionsService.findAll(userId);
  }

  @MessagePattern(patterns.TRANSACTION.GET_SUMMARY)
  async getTransactionSummary({ userId }) {
    return this.transactionsService.getTransactionSummary(userId);
  }

  @MessagePattern(patterns.TRANSACTION.GET_MONTHLY_STATS)
async getMonthlyStats({ userId }) {
  return this.transactionsService.getMonthlyStats(userId);
}

}
