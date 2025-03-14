import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { userDTO } from '../user/dto/user.dto';
import { userService } from './user.service';

@Controller()
export class userController {
  private readonly logger = new Logger(userController.name);
  constructor(private readonly userService: userService) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data: userDTO) {
    console.log(data);
    this.logger.log('Creating user');
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'login' })
  async loginMember(data: userDTO){
    this.logger.log('Login user');
    return this.userService.loginUser(data);
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  async findUserById(id: string) {
    return this.userService.findUserById(id);
  }

  @MessagePattern({ cmd: 'find_user_by_email' })
  async findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(data: { id: string; dto: userDTO }) {
    return this.userService.updateUser(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(email: string) {
    return this.userService.resetPassword(email);
  }

  @MessagePattern({ cmd: 'list_users' })
  async listUsers() {
    return this.userService.listUsers();
  }
}