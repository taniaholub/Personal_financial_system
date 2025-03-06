import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  async getData() {
    // Виконуємо SQL-запит за допомогою DatabaseService
    const result = await this.databaseService.query('SELECT * FROM personal_financial_system');
    return result;
  }
}

