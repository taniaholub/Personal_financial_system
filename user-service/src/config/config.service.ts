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
}
