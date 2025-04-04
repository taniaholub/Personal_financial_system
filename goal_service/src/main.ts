import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@127.0.0.1:5672'],
        queue: 'goal_service',
        queueOptions: { durable: false },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();

  await app.listen(3007);
  console.log('Goal Service is running and connected to RabbitMQ');
}

bootstrap();
