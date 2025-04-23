import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../entity/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(transaction: Partial<Transaction>) {
    return this.transactionRepository.save(transaction);
  }

  findAll(
    user_id: string,
    type?: string,
    category?: string,
    month?: string, // Новий параметр для фільтрації за місяцем
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :user_id', { user_id });

    if (type) query.andWhere('transaction.type = :type', { type });
    if (category) query.andWhere('transaction.category = :category', { category });
    if (month) {
      // Фільтрація за місяцем (YYYY-MM)
      query.andWhere("TO_CHAR(transaction.transaction_date, 'YYYY-MM') = :month", { month });
    }
    if (sortBy) {
      query.orderBy(`transaction.${sortBy}`, sortOrder || 'ASC');
    }

    return query.getMany();
  }

  delete(id: string) {
    return this.transactionRepository.delete(id);
  }

  async getTransactionSummary(userId: string, month?: string) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId });

    if (month) {
      query.andWhere("TO_CHAR(transaction.transaction_date, 'YYYY-MM') = :month", { month });
    }

    const transactions = await query.getMany();

    const monthlySummary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.monthlyIncome += Number(transaction.amount);
        } else {
          acc.monthlyExpense += Number(transaction.amount);
        }
        return acc;
      },
      { monthlyIncome: 0, monthlyExpense: 0 }
    );

    // Загальний баланс (усі транзакції без фільтрації за місяцем)
    const allTransactions = await this.transactionRepository.find({
      where: { user_id: userId },
    });

    const totalSummary = allTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += Number(transaction.amount);
        } else {
          acc.expense += Number(transaction.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return { ...totalSummary, ...monthlySummary };
  }

}