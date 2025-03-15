import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { userDTO } from '../user/dto/user.dto';
import { userService } from './user.service';
import { patterns } from '../patterns';

@Controller()
export class userController {
  private readonly logger = new Logger(userController.name);
  constructor(private readonly userService: userService) { }

  @MessagePattern(patterns.USER.CREATE)
  async createUser(data: userDTO) {
    this.logger.log('Creating user');
    return this.userService.createUser(data);
  }

  @MessagePattern(patterns.AUTH.LOGIN)
  async loginMember(data: userDTO) {
    this.logger.log('Login user');
    return this.userService.loginUser(data);
  }

  @MessagePattern(patterns.USER.FIND_BY_ID)
  async findUserById(dto) {
    return this.userService.findUserById(dto);
  }

  @MessagePattern(patterns.USER.FIND_BY_EMAIL)
  async findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  @MessagePattern(patterns.USER.DELETE)
  async deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }

  @MessagePattern(patterns.USER.UPDATE)
  async updateUser(data: { id: string; dto: userDTO }) {
    return this.userService.updateUser(data.id, data.dto);
  }

  @MessagePattern(patterns.USER.RESET_PASSWORD)
  async resetPassword(email: string) {
    return this.userService.resetPassword(email);
  }

  @MessagePattern(patterns.USER.FIND_ALL)
  async listUsers() {
    return this.userService.listUsers();
  }
}