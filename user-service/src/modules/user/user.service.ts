import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { userDTO } from './dto';
import { User } from '../../entity/user.entity';
import { Role } from '../../entity/role.entity';

@Injectable()
export class userService {
  private readonly logger = new Logger(userService.name);

  constructor(
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
      throw new NotFoundException(`Role ${role} not found`);
    }

    const userData = { email, username, password: userPassword };

    const user = this.userRepository.create({
      ...userData,
      role_id: roleEntity.id,
    });

    return this.userRepository.save(user);
  }

  async findUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userRepository.delete(id);
  }

  async updateUser(id: string, dto: userDTO) {
    const user = await this.findUserById(id);
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