import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Імпорт конфігураційного модуля
import { OrmModule } from './module/orm/orm.module'; // Імпорт модуля, що містить налаштування TypeORM
import { GoalsModule } from './module/goals/goals.module'; // Імпорт модуля транзакцій

@Module({
  imports: [
    // Імпортуємо глобальний конфігураційний модуль
    ConfigModule.forRoot({
      isGlobal: true, // робимо конфігурацію глобально доступною для всього застосунку
      envFilePath: '.env', // вказуємо шлях до файлу конфігурації
    }),
    OrmModule, // Підключаємо ORM модуль для роботи з базою даних
    GoalsModule, // Підключаємо модуль, що містить логіку роботи з транзакціями
  ],
})
export class AppModule {}
