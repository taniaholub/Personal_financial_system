import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { TokenPayload, Tokens } from './dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async generateTokens(payload: TokenPayload): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn:
                    this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
            }),
            this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn:
                    this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            });
        } catch (error: unknown) {  // додаємо тип для 'error'
            if (error instanceof Error) {
                throw new RpcException(error.message);  // тепер можна звертатися до 'message'
            }
            throw new RpcException('Unknown error occurred during token verification');
        }
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
        } catch (error: unknown) {  // додаємо тип для 'error'
            if (error instanceof Error) {
                throw new RpcException(error.message);  // тепер можна звертатися до 'message'
            }
            throw new RpcException('Unknown error occurred during token verification');
        }
    }


    async refreshTokens(refreshToken: string): Promise<Tokens> {
        const decoded = await this.verifyRefreshToken(refreshToken);
        const tokens = await this.generateTokens({
            memberId: decoded.memberId,
            role_id: decoded.role_id,
        });

        return tokens;
    }
}