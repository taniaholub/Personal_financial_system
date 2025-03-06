import { Injectable } from '@nestjs/common';
import { Client, QueryConfig, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  private client: Client;

  constructor() {
    this.client = new Client({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
    });

    // Підключення до бази даних
    this.client.connect()
      .then(() => console.log('Connected to PostgreSQL via pg'))
      .catch((err: Error) => {
        console.error('Error connecting to PostgreSQL', err.stack);
      });
  }

  // Метод для виконання SQL-запитів
  async query<T = any>(queryText: string, params?: any[]): Promise<T[]> {
    try {
      const queryConfig: QueryConfig = { text: queryText, values: params };
      const result: QueryResult = await this.client.query(queryConfig);
      return result.rows;
    } catch (err) {
      console.error('Error executing query', (err as Error).stack);
      throw err;
    }
  }

  // Підключення до бази даних
  getClient(): Client {
    return this.client;
  }
}
