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
  async getUserTransactions({ userId, month }) {
    return this.transactionsService.findAll(userId, undefined, undefined, month);
  }

  @MessagePattern(patterns.TRANSACTION.GET_SUMMARY)
  async getTransactionSummary({ userId, month }) {
    return this.transactionsService.getTransactionSummary(userId, month);
  }
}