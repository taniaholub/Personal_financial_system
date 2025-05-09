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

  // Створення нової транзакції
  create(transaction: Partial<Transaction>) {
    return this.transactionRepository.save(transaction); // Збереження транзакції в базі даних
  }

  // Отримання транзакцій з фільтрацією та сортуванням
  findAll(
    user_id: string,
    type?: string,
    category?: string,
    month?: string, // Фільтрація за місяцем у форматі YYYY-MM
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :user_id', { user_id }); // Фільтрація за ID користувача

    if (type) query.andWhere('transaction.type = :type', { type }); // Фільтрація за типом
    if (category) query.andWhere('transaction.category = :category', { category }); // Фільтрація за категорією
    if (month) {
      // Фільтрація за місяцем шляхом форматування дати
      query.andWhere("TO_CHAR(transaction.transaction_date, 'YYYY-MM') = :month", { month });
    }
    if (sortBy) {
      query.orderBy(`transaction.${sortBy}`, sortOrder || 'ASC'); // Сортування за вказаним полем
    }

    return query.getMany(); // Виконання запиту та повернення результатів
  }

  // Видалення транзакції за ID
  delete(id: string) {
    return this.transactionRepository.delete(id); // Видалення транзакції з бази даних
  }

  // Отримання зведення транзакцій (загального та за місяцем)
  async getTransactionSummary(userId: string, month?: string) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId }); // Фільтрація за ID користувача

    if (month) {
      // Фільтрація за місяцем
      query.andWhere("TO_CHAR(transaction.transaction_date, 'YYYY-MM') = :month", { month });
    }

    const transactions = await query.getMany(); // Отримання транзакцій

    // Обчислення місячного зведення
    const monthlySummary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.monthlyIncome += Number(transaction.amount); // Додавання доходів
        } else {
          acc.monthlyExpense += Number(transaction.amount); // Додавання витрат
        }
        return acc;
      },
      { monthlyIncome: 0, monthlyExpense: 0 }
    );

    // Обчислення загального зведення (усі транзакції користувача)
    const allTransactions = await this.transactionRepository.find({
      where: { user_id: userId },
    });

    const totalSummary = allTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += Number(transaction.amount); // Додавання загальних доходів
        } else {
          acc.expense += Number(transaction.amount); // Додавання загальних витрат
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return { ...totalSummary, ...monthlySummary }; // Повернення об'єднаного зведення
  }
}