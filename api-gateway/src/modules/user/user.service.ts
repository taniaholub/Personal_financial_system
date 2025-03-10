import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class UserService {
  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: { username: string; password: string; role: string }) {
    console.log('User registered:', data);
    return { message: `User ${data.username} registered successfully!` };
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Payload() data: { username: string; password: string }) {
    console.log('User login attempt:', data);
    return { message: `User ${data.username} logged in successfully!` };
  }
}