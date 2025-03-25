import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { TransactionController } from './modules/transaction/transaction.controller';
//import { TransactionModule } from './modules/transaction/transaction.module';

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
  ],
  controllers: [TransactionController], // Додаємо контролер транзакцій
})
export class AppModule {}
