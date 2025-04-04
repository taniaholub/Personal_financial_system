import { Controller, Post, Get, Param, Body, Put, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateGoalDto } from './dto/goal.dto';
import { patterns } from '../patterns';

@Controller('goals')
export class GoalController {
  private readonly logger = new Logger(GoalController.name);

  constructor(@Inject('GOAL_SERVICE') private readonly goalClient: ClientProxy) {}

  @Post()
  async createGoal(@Body() goalData: CreateGoalDto) {
    this.logger.log('Creating goal');
    return this.goalClient.send(patterns.GOAL.CREATE, goalData);
  }

  @Get(':userId')
  async getUserGoals(@Param('userId') userId: string) {
    this.logger.log(`Fetching goals for user ${userId}`);
    return this.goalClient.send(patterns.GOAL.GET, { userId });
  }

  @Put(':id')
  async updateGoal(@Param('id') id: string, @Body() goalData: CreateGoalDto) {
    this.logger.log(`Updating goal with id ${id}`);
    return this.goalClient.send(patterns.GOAL.UPDATE, { id, goalData });
  }

  @Get(':userId/summary')
  async getGoalSummary(@Param('userId') userId: string) {
    this.logger.log(`Fetching goal summary for user ${userId}`);
    return this.goalClient.send(patterns.GOAL.GET_SUMMARY, { userId });
  }
}
