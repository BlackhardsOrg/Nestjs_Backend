import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/providers/services/auth.service';
import {
  IMessageResponse,
  IUserLoginRequestData,
  IUserLoginResponseData,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { AuthGuard } from '../../guards/auth.guard';
import { ActiveGuard } from '../../guards/active.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageHelper: MessageHelper,
  ) {}

  @Post('register')
  async register(
    @Body() userData: IUserRegisterRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    try {
      if (!userData.email || !userData.password) {
        throw new BadRequestException('Invalid Inputs');
      }
      console.log(userData, 'USERDATA');
      const responseData = await this.authService.register(userData);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }
  @UseGuards(ActiveGuard)
  @Post('login')
  async login(
    @Body() userLoginData: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      const responseData = await this.authService.login(userLoginData);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode || 401;
      return this.messageHelper.ErrorResponse(
        err.message,
        err.response.statusCode,
      );
    }
  }

  @Post('forgotten-password')
  async forgottenPassword(
    @Body('email') email: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.forgottenPassword(email);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('resetToken') resetToken: string,
    @Body('newPassword') newPassword: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.resetPassword(
        email,
        resetToken,
        newPassword,
      );
      response.statusCode = 201;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() request: Request,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const userId = request['user'].sub;
      console.log(userId, 'USERID', request['user'], request['user'].sub);
      if (!userId || !oldPassword || !newPassword) {
        throw new BadRequestException('Invalid Inputs');
      }
      const responseData = await this.authService.changePassword(
        userId,
        oldPassword,
        newPassword,
      );
      response.statusCode = 201;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('email') email: string,
    @Query('verifyToken') verifyToken: string,

    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.verifyEmail(
        email,
        verifyToken,
      );
      response.statusCode = 201;
      return responseData;
    } catch (err) {
      console.log(err);
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('resend-verification-email')
  async resendVerificationMail(
    @Body('email') email: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData =
        await this.authService.resendVerificationEmail(email);
      response.statusCode = 201;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const authToken = request['user'].token;
      const responseData = await this.authService.logout(authToken);
      response.statusCode = 201;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }
}
