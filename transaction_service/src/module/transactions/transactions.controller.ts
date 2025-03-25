import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern('create_transaction')
  async createTransaction(transactionData) {
    return this.transactionsService.create(transactionData);
  }

  @MessagePattern('get_transactions')
  async getUserTransactions({ userId }) {
    return this.transactionsService.findAll(userId);
  }

  @MessagePattern('get_transaction_summary')
  async getTransactionSummary({ userId }) {
    return this.transactionsService.getTransactionSummary(userId);
  }
}
