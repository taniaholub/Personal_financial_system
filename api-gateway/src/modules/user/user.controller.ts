import { Controller, Post, Body, Request, Inject, Req, Logger, BadRequestException, UseGuards, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../../guards/auth.guard';


@Controller('users')
//@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}


  /*@Get('login')
  getlogin(): string {
    return 'Login endpoint is working!';
  }*/
  

  @Post('login')
  async loginUser(@Req() req, @Body() body: { username: string; password: string }) {
    this.logger.log("Login new user");

    if (!req.user?.memberId) {
      throw new BadRequestException('User memberId is missing.');
    }

    return await firstValueFrom(
      this.userService.send('loginUser', { sender_member_id: req.user.memberId, ...body })
    );
  }

  @Post('register')
  async registerUser(@Req() req, @Body() body: { username: string; password: string; role: string }) {
    this.logger.log("Register new user");

    if (!req.user?.memberId) {
      throw new BadRequestException('User memberId is missing.');
    }
    return await firstValueFrom(
      this.userService.send('registerUser', { sender_member_id: req.user.memberId, ...body })
    );
  }
}
