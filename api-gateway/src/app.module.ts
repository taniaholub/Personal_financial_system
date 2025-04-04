import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TransactionController } from './modules/transaction/transaction.controller';
import { GoalController } from './modules/goal/goal.controller';

@Module({
  imports: [UserModule],
  providers: [
    AppService,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@127.0.0.1:5672'],
            queue: 'api_gateway_queue',
            queueOptions: { durable: false },
          },
        });
      },
    },
    {
      provide: 'TRANSACTION_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@127.0.0.1:5672'],
            queue: 'transaction_service',
            queueOptions: { durable: false },
          },
        });
      },
    },
    {
      provide: 'GOAL_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@127.0.0.1:5672'],
            queue: 'goal_service', // Назва черги для сервісу Goal
            queueOptions: { durable: false },
          },
        });
      },
    },
  ],
  controllers: [TransactionController, GoalController], // Додаємо контролери для транзакцій та цілей
})
export class AppModule {}
