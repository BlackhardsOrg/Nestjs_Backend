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
export class ActiveGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request['user'], 'REW');
    try {
      let user;
      // Fetch the user from the database
      if (request['body'].email) {
        user = await this.userService.findOneByEmail(request['body'].email);
      } else if (request['params'].id) {
        user = await this.userService.findOneByUserId(request['params'].id);
      } else {
        throw new UnauthorizedException('Invalid Input');
      }
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify that user has the admin role
      if (!user.isActive) {
        throw new ForbiddenException(
          'Access denied: This Account is not Active',
        );
      }
      // Assign the payload and user to the request object
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err.message);
    }
    return true;
  }
}
