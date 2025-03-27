import { Controller, Post, Get, Param, Body, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/transaction.dto';
import { patterns } from '../patterns';
@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(@Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientProxy) {}

  @Post()
  async createTransaction(@Body() transactionData: CreateTransactionDto) {
    this.logger.log('Creating transaction');
    return this.transactionClient.send(patterns.TRANSACTION.CREATE, transactionData);
  }

  @Get(':userId')
  async getUserTransactions(@Param('userId') userId: string) {
    this.logger.log(`Fetching transactions for user ${userId}`);
    return this.transactionClient.send(patterns.TRANSACTION.GET, { userId });
  }

  @Get(':userId/summary')
  async getTransactionSummary(@Param('userId') userId: string) {
    this.logger.log(`Fetching transaction summary for user ${userId}`);
    return this.transactionClient.send(patterns.TRANSACTION.GET_SUMMARY, { userId });
  }
}
