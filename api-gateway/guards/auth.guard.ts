import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
  } from '@nestjs/common';
  import { firstValueFrom } from 'rxjs';
  import { Inject } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1]; // Виділяємо токен
      this.logger.log(`Отриманий токен: ${token}`);
      if (!token) {
        this.logger.warn('Токен відсутній у запиті');
        return false;
      }
  
      try {
        // Відправляємо запит до user-service для верифікації токена
        const $user = await firstValueFrom(
          this.userClient.send({ cmd: 'auth.verify' }, { token }),
        );
        this.logger.log(`Верифікований користувач: ${JSON.stringify($user)}`);
        // Додаємо користувача в request для використання в контролерах
        request.user = $user;
        return true;
      } catch (err) {
        this.logger.error(err);
        this.logger.error(`Помилка верифікації токена: ${err.message}`);
        return false;
      }
    }
  }
  
  