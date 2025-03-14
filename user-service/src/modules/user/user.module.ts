import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userService } from './user.service';
import { userController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

import { User } from '../../entity/user.entity';
import { Role } from '../../entity/role.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Role])],
  providers: [userService],
  controllers: [userController],
})
export class UserModule {}
