// user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { MessageHelper } from '../helpers/messages.helpers';
import { IMessageResponse, IUser } from 'src/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private messageHelper: MessageHelper,
  ) {}

  async findOneById(userId: string): Promise<User | null> {
    return await this.userModel.findById(userId).exec();
  }

  async findOneByUserId(userId: string): Promise<User | null> {
    return this.userModel
      .findOne({ id: userId })
      .select('-passwordHash -resetToken')
      .exec();
  }

  async findByVerificationToken(
    verificationToken: string,
  ): Promise<User | null> {
    return await this.userModel.findOne({ verificationToken }).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async UpdateUser(userData: User): Promise<boolean> {
    const userInfo = await this.userModel.findOne({ email: userData.email });
    userInfo.studioName = userData.studioName;
    userInfo.studioDescription = userData.studioDescription;
    userInfo.resetToken = userData.resetToken;

    const result = await this.userModel
      .updateOne({ email: userData.email }, userInfo)
      .exec();
    console.log(result, userInfo, 'CHECK');

    if (!result) throw new BadRequestException('Unable to  Update user');
    return true;
  }

  async UpdatePassword(userData: User): Promise<boolean> {
    const userInfo = await this.userModel.findOne({ email: userData.email });
    userInfo.passwordHash = userData.passwordHash;

    const result = await this.userModel
      .updateOne({ email: userData.email }, userInfo)
      .exec();
    console.log(result, userInfo, 'CHECK');

    if (!result)
      throw new BadRequestException('Unable to  Update user password');
    return true;
  }

  async verifyEmail(userData: User): Promise<boolean> {
    const userInfo = await this.userModel.findOne({ email: userData.email });
    userInfo.emailVerified = true;

    const result = await this.userModel
      .updateOne({ email: userData.email }, userInfo)
      .exec();
    console.log(result, userInfo, 'CHECK');

    if (!result) throw new BadRequestException('Email Verification Updated');
    return true;
  }

  async promoteToAdmin(userEmail: string): Promise<IMessageResponse<boolean>> {
    console.log(userEmail, 'USERMEAil');
    const userInfo = await this.userModel.findOne({ email: userEmail });
    if (!userInfo.roles.includes('admin')) {
      userInfo.roles.push('admin');
    }

    const result = await this.userModel
      .updateOne({ email: userEmail }, userInfo)
      .exec();
    console.log(result, userInfo, 'CHECK');

    if (!result) throw new BadRequestException('Error promoting Account');
    const responseData = this.messageHelper.SuccessResponse(
      'Users Fetched Successfully',
      true,
    );
    return responseData;
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }

  async FindAllUsers(): Promise<IMessageResponse<IUser[] | null>> {
    console.log('USERS');

    const users = await this.userModel
      .find()
      .select('-passwordHash -resetToken')
      .exec();
    const responseData = this.messageHelper.SuccessResponse(
      'Users Fetched Successfully',
      users,
    );
    console.log(responseData, 'USERS');

    return responseData;
  }

  async deleteUser(email: string): Promise<IMessageResponse<boolean>> {
    const result = await this.userModel.deleteOne({ email }).exec();
    if (!result) throw new BadRequestException('Unable to delete user');
    const responseData = this.messageHelper.SuccessResponse(
      'User Deleted Successfully!',
      true,
    );

    return responseData;
  }

  async deactivateAccount(email: string): Promise<IMessageResponse<boolean>> {
    const result = await this.userModel.findOne({ email }).exec();
    result.isActive = false;
    await result.save();
    if (!result) throw new BadRequestException('Unable to deactivate Account');
    const responseData = this.messageHelper.SuccessResponse(
      'Account Deactivated Successfully!',
      true,
    );

    return responseData;
  }

  async activateUser(email: string): Promise<IMessageResponse<boolean>> {
    const result = await this.userModel.findOne({ email }).exec();
    result.isActive = true;
    await result.save();
    if (!result) throw new BadRequestException('Unable to activate Account');
    const responseData = this.messageHelper.SuccessResponse(
      'Account Activated Successfully!',
      true,
    );

    return responseData;
  }
}
