import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './config/config'; // Імпортуємо конфігурацію

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmModuleOptions,  // Використовуємо конфігурацію для підключення до БД
      migrations: [__dirname + '/../../migrations/*.{js,ts}'], // Вказуємо шлях до міграцій
      entities: [__dirname + '/../../entity/*.entity.{js,ts}'], // Вказуємо шлях до сутностей
    }),
  ],
})
export class OrmModule {}
