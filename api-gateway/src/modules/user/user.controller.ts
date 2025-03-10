import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Post('login')
  async loginUser(@Body() data: { username: string; password: string }) {
    console.log('Login request received:', data);
    return firstValueFrom(this.userService.send({ cmd: 'login_user' }, data));
  }

  @Post('register')
  async registerUser(@Body() data: { username: string; password: string; role: string }) {
    console.log('Register request received:', data);
    return firstValueFrom(this.userService.send({ cmd: 'create_user' }, data));
  }
}
