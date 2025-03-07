import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5672'],
      queue: 'user-service',
      queueOptions: { durable: false },
    },
  });

  await app.listen();
  console.log('User Service is running and connected to RabbitMQ');
}

bootstrap();