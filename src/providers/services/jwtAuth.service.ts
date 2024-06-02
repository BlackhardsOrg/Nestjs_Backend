// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenService } from './invalidTokens.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly invalidTokenService: InvalidTokenService,
    private configService: ConfigService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    console.log(this.configService.get<string>('auth.jwtSecret'), 'KWAALs');

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('auth.jwtSecret'),
    });
  }

  async invalidateToken(token: string): Promise<void> {
    // Add the token to the invalidated tokens collection
    await this.invalidTokenService.addInvalidatedToken(token);
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    // Check if the token is in the invalidated tokens collection
    return this.invalidTokenService.isTokenInvalid(token);
  }
}
