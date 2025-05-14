import { Controller, Post, Get, Param, Body, Put, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateGoalDto } from './dto/goal.dto';
import { patterns } from '../patterns';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@Controller('goals')
export class GoalController {
  private readonly logger = new Logger(GoalController.name);

  constructor(@Inject('GOAL_SERVICE') private readonly goalClient: ClientProxy) {}

  @Post()
  async createGoal(@Body() goalData: CreateGoalDto) {
    this.logger.log('Creating goal');
    try {
      const result = await firstValueFrom(
        this.goalClient.send(patterns.GOAL.CREATE, goalData).pipe(
          timeout(5000),
          catchError(err => {
            this.logger.error(`Error creating goal: ${err.message}`, err.stack);
            throw new HttpException(
              'Failed to create goal: ' + (err.message || 'Unknown error'),
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      this.logger.log('Goal created successfully');
      return result;
    } catch (error) {
      this.logger.error('Error creating goal', error.stack);
      throw new HttpException(
        'Failed to create goal: ' + (error.message || 'Unknown error'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

@Get(':userId')
async getUserGoals(@Param('userId') userId: string) {
  this.logger.log(`Fetching goals for user ${userId}`); // Лог 1
  try {
    const result = await firstValueFrom(
      this.goalClient.send(patterns.GOAL.GET, { userId }).pipe( // Надсилаємо { userId: 'значення' }
        timeout(5000),
        catchError(err => {
          // Якщо мікросервіс повертає помилку, або є проблема зі з'єднанням/таймаутом
          this.logger.error(`Error fetching goals FROM MICROSERVICE: ${err.message}`, err.stack, JSON.stringify(err)); // Лог 2 - ДУЖЕ ВАЖЛИВИЙ
          throw new HttpException(
            'Failed to fetch goals: ' + (err.message || 'Unknown error'), 
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      )
    );
    
    return Array.isArray(result) ? result : []; // Повертаємо результат, якщо це масив
  } catch (error) {
    this.logger.error(`Error in getUserGoals controller method for user ${userId}. Error type: ${error.constructor.name}`, error.stack, error.message); // Лог 4
    if (error instanceof HttpException) {
        throw error; // Перекидуємо вже сформовану HttpException
    }
    // Якщо це не HttpException, загортаємо в HttpException
    throw new HttpException(
      'Failed to fetch goals (controller catch): ' + (error.message || 'Unknown error'),
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

  @Put(':id')
  async updateGoal(@Param('id') id: string, @Body() goalData: CreateGoalDto) {
    this.logger.log(`Updating goal with id ${id}`);
    try {
      const result = await firstValueFrom(
        this.goalClient.send(patterns.GOAL.UPDATE, { id, goalData }).pipe(
          timeout(5000),
          catchError(err => {
            this.logger.error(`Error updating goal: ${err.message}`, err.stack);
            throw new HttpException(
              'Failed to update goal: ' + (err.message || 'Unknown error'),
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      return result;
    } catch (error) {
      this.logger.error(`Error updating goal with id ${id}`, error.stack);
      throw new HttpException(
        'Failed to update goal: ' + (error.message || 'Unknown error'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}