import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5672'],
      queue: 'goal_service', // використовуємо ту ж назву, що й у клієнтському проксі
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('API Gateway is running on http://localhost:3000');
}
bootstrap();
