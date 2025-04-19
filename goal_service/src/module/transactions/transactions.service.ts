import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

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
    sortBy?: string, // Параметр для сортування
    sortOrder?: 'ASC' | 'DESC', // Параметр для порядку сортування
  ) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :user_id', { user_id });

    // Фільтрація за типом
    if (type) query.andWhere('transaction.type = :type', { type });

    // Фільтрація за категорією
    if (category)
      query.andWhere('transaction.category = :category', { category });

    // Сортування
    if (sortBy) {
      query.orderBy(`transaction.${sortBy}`, sortOrder || 'ASC');
    }

    return query.getMany();
  }

  delete(id: string) {
    return this.transactionRepository.delete(id);
  }
  async getTransactionSummary(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { user_id: userId },
    });

    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += Number(transaction.amount);
        } else {
          acc.expense += Number(transaction.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );

    return summary;
  }

  async getMonthlyStats(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { user_id: userId },
    });
  
    const monthlyMap = new Map();
  
    for (const tx of transactions) {
      const date = new Date(tx.transaction_date); // <-- ВАЖЛИВО!
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`; // YYYY-MM
  
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthKey, income: 0, expense: 0 });
      }
  
      const entry = monthlyMap.get(monthKey);
      if (tx.type === 'income') {
        entry.income += Number(tx.amount);
      } else {
        entry.expense += Number(tx.amount);
      }
    }
  
    return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }
  
}
