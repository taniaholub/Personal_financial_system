import { Controller, Post, Body, Request, Inject, Req, Logger, BadRequestException, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../../../guards/auth.guard';
import { User } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registrationUser(@Body() user: User) {
    this.logger.log(`Received registration data: ${JSON.stringify(user)}`);
    try {
      return await this.userService.registrationUser(user);
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  @Post('login')
  async loginUser(@Body() user: User) {
    this.logger.log('Login user');
    return this.userService.loginUser(user);
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getMemberData(@Req() req){
    return this.userService.getMember({ memberId: req.user.memberId });
  }

  @Get('list')
  async getMembers() {
    return this.userService.findAllUsers()
  }
}
