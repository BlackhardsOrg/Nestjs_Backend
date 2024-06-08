import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/providers/services/user.service';
import { AuthGuard } from '../../guards/auth.guard';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { Request, Response } from 'express';
import { IMessageResponse, IUser } from 'src/interfaces';
import { Types } from 'mongoose';
import { AdminGuard } from '../../guards/admin.guard';
import { ActiveGuard } from '../../guards/active.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private messageHelper: MessageHelper,
  ) {}

  @UseGuards(ActiveGuard)
  @Get('profile/:id')
  async fetchProfile(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Check if the ID is valid
      // if (!Types.ObjectId.isValid(id)) {
      //   throw new ForbiddenException('Invalid Id');
      // }
      // Call the NotificationService to fetch notifications
      const user = await this.userService.findOneByUserId(id);
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse('Retrieval Successful', user);
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('/admin/profile/:id')
  async fetchProfileAdmin(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Check if the ID is valid
      // if (!Types.ObjectId.isValid(id)) {
      //   throw new ForbiddenException('Invalid Id');
      // }
      // Call the NotificationService to fetch notifications
      const user = await this.userService.findOneByUserId(id);
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse('Retrieval Successful', user);
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request['user'].email;

      // Call the NotificationService to fetch notifications
      const transactions = await this.userService.UpdateUser({
        ...request.body,
        email: userEmail,
      });

      response.statusCode = 200;
      const responseData = this.messageHelper.SuccessResponse(
        'User Updated Successfully',
        transactions,
      );
      console.log('HUS', responseData);

      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  // @UseGuards(AdminGuard)
  @Get('/admin/find-all-users')
  async findAllUsers(
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUser[] | null>> {
    try {
      // Extract the user's email from the authenticated user
      console.log('USERS');

      // Call the NotificationService to fetch notifications

      const users = await this.userService.FindAllUsers();
      console.log(users, 'USERS');
      response.statusCode = 200;

      return users;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('/admin/delete-user')
  async deleteUser(
    @Body() userData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    try {
      if (!userData.email) throw new BadRequestException('Invlid input');
      const result = await this.userService.deleteUser(userData.email);
      response.statusCode = 200;
      return result;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('/admin/deactivate-user')
  async deactivateUser(
    @Req() request: Request,
    @Body('email') email,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = email;

      // Call the NotificationService to fetch notifications
      const result = await this.userService.deactivateAccount(userEmail);
      response.statusCode = 200;

      return result;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard)
  @Post('deactivate-account')
  async deactivateAccount(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request['user'].email;

      // Call the NotificationService to fetch notifications
      const results = await this.userService.deactivateAccount(userEmail);
      response.statusCode = 200;

      return results;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('/admin/activate-user')
  async activateUser(
    @Req() request: Request,
    @Body('email') email,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = email;

      // Call the NotificationService to fetch notifications
      const result = await this.userService.activateUser(userEmail);
      response.statusCode = 200;

      return result;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('/admin/promote-to-admin')
  async promoteToAdmin(
    @Body() userdata,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    try {
      // Call the NotificationService to fetch notifications
      const result = await this.userService.promoteToAdmin(userdata.email);
      response.statusCode = 200;

      return result;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }
}
