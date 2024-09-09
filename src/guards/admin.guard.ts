import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IUser, IUserLoginRequestData } from 'src/interfaces';
import { UserService } from 'src/providers/services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      // Fetch the user from the database
      const user = await this.userService.findOneById(request['user'].sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify that user has the admin role
      if (!user.roles || !user.roles.includes('admin')) {
        throw new ForbiddenException('Access denied: Admins only');
      }
      // Assign the payload and user to the request object
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err.message);
    }
    return true;
  }
  F;
}
