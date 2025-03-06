import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) { }

  public isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  public getEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  public getBrockerUri(): string {
    return this.configService.get<string>('BROCKER_URI', 'amqp://guest:guest@127.0.0.1:5672');
  }

  public getPort(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  public getDatabaseConfig() {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_NAME', 'mydb'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: this.configService.get<boolean>('DB_SYNC', true),
    };
  }
}
