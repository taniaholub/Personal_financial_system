import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { AuthService } from '../auth/auth.service';

import { userDTO } from '../user/dto';
import { Role } from '../../entity/role.entity';
import { User } from '../../entity/user.entity';

@Injectable()
export class userService {
  private readonly logger = new Logger(userService.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(dto: { username: string; password: string; role: string }) {
    this.logger.log(`Creating user: ${JSON.stringify(dto)}`);
    const { username, role } = dto;
    const userPassword = uuidv4().slice(0, 8);

    // Generationon email on the basis username
    const email = `${username}@gmail.com`;

    const roleEntity = await this.roleRepository.findOneBy({ name: role });
    if (!roleEntity) {
      throw new RpcException(`Role ${role} not found`);
    }

    const userData = { email, username, password: userPassword };
    
    const $user = this.userRepository.create({
      ...userData,
      role_id: roleEntity.id,
    });

   
    const user = await this.userRepository.save($user);
  
    return this.authService.generateTokens({
      memberId: user.id,
      role_id: user.role_id,
    });
  }

  async loginUser(dto: { email: string; password: string }) {
    const user = await this.userRepository.find({
      where: { email: dto.email },
    });

    if (dto.password !== user[0].password) {
      throw new RpcException('Incorrect password');
    }

    return this.authService.generateTokens({
      memberId: user[0].id,
      role_id: user[0].role_id,
    });
  }

  async findUserById(data: {id: string}) {
    return this.userRepository.findOne({where: { id: data.id }});
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async deleteUser(id: string) {
    const user = await this.findUserById({ id });
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userRepository.delete(id);
  }

  async updateUser(id: string, dto: userDTO) {
    const user = await this.findUserById({ id });
    if (!user) {
      throw new RpcException('User not found');
    }

    const roleEntity = await this.roleRepository.findOneBy({ name: dto.role });
    if (!roleEntity) {
      throw new NotFoundException(`Role ${dto.role} not found`);
    }

    const { role: _, ...updateData } = dto;
    return this.userRepository.save({
      ...user,
      ...updateData,
      role_id: roleEntity.id,
    });
  }

  async resetPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userRepository.save({ ...user, password: 'user' });
  }

  async listUsers() {
    return this.userRepository.find();
  }
}
