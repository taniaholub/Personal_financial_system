import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.model';
import { OrmModule } from './orm/orm.module';

@Module({ imports: [AuthModule, OrmModule, UserModule],})
export class ModulesModule {}