import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { patterns } from '../patterns';
import { User } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private send(pattern: any, data: any): Promise<unknown> {
    const res$ = this.userClient.send(pattern, data).pipe(
      timeout(30000),
      catchError((e: Error) => {
        this.logger.error(e);
        return throwError(() => e);
      }),
    );
    return firstValueFrom(res$);
  }

  async registrationUser(dto: User) {
    this.logger.log('Registration user');
    return this.send(patterns.USER.CREATE, dto);
  }

  async loginUser(dto: { email: string; password: string }) {
    this.logger.log(`Logging in user with email: ${dto.email}`);
    return this.send(patterns.USER.LOGIN, dto);
  }

  async getMember(dto: {memberId: string}){
    return this.send(patterns.USER.FIND_BY_ID, dto);
  }
}