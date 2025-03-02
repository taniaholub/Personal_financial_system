import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

// Import the types
import { Tokens, TokenPayload } from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.tokens')
  async generateTokens(dto): Promise<Tokens> {
    this.logger.log('Generating tokens');
    return this.authService.generateTokens(dto);
  }

  @MessagePattern('auth.verify')
  async verifyToken(dto): Promise<TokenPayload> {
    this.logger.log('Verifying token');
    return this.authService.verifyAccessToken(dto);
  }

  @MessagePattern('auth.refresh')
  async refreshTokens(dto): Promise<Tokens> {
    this.logger.log('Refreshing tokens');
    return this.authService.refreshTokens(dto);
  }
}