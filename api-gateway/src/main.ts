import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  await app.listen(3000); // Або ваш порт для api-gateway
  console.log(`API Gateway is running on http://localhost:${await app.getUrl().then(url => new URL(url).port)}`);
}
bootstrap();