import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  IMailData,
  IMessageResponse,
  IUserLoginRequestData,
  IUserLoginResponseData,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';
import { User } from 'src/models/user.model';
import { MessageHelper } from '../helpers/messages.helpers';
import { MailService } from './mail.service';
import { UserService } from './user.service';
import { JwtAuthService } from './jwtAuth.service';
import { InvalidTokens } from 'src/models/InvalidTokens.model';

@Injectable()
export class AuthService {
  constructor(
    private messagehelper: MessageHelper,
    private readonly mailService: MailService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(InvalidTokens.name)
    private readonly invalidTokens: Model<InvalidTokens>,
  ) {}

  async register(
    createUserData: IUserRegisterRequestData,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    const checkUser = await this.userModel.findOne({
      email: createUserData.email,
    });
    console.log(checkUser, createUserData);
    if (checkUser)
      throw new UnauthorizedException(
        'This email has been used comrade! Login to access your account',
      );
    const hash = await bcrypt.hash(createUserData.password, 10);
    const createdUser = new this.userModel({
      studioName: createUserData.studioName,
      email: createUserData.email,
    });
    const verificationToken = await bcrypt.hash(
      `${createdUser.email}${Date.now()}`,
      10,
    );

    createdUser.resetToken = verificationToken;
    createdUser.passwordHash = hash;
    await createdUser.save();
    await this.mailService.sendVerificationEmail(
      createdUser.email,
      verificationToken,
    );
    return this.messagehelper.SuccessResponse<IUserRegisterResponseData>(
      'Registration was successful! Verification Email sent',
      {
        name: createdUser.studioName,
        email: createdUser.email,
      },
    );
  }

  async sendMail(
    mailData: IMailData,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    await this.mailService.sendInternEmail(
      mailData.name,
      mailData.role,
      mailData.email,
    );
    return this.messagehelper.SuccessResponse<IUserRegisterResponseData>(
      'Mail was sent successful!',
      {
        name: mailData.name,
        email: mailData.email,
      },
    );
  }

  async resendVerificationEmail(
    email: string,
  ): Promise<IMessageResponse<boolean | null>> {
    const user = await this.userModel.findOne({ email: email }).exec();
    const verificationToken = await bcrypt.hash(
      `${user.email}${Date.now()}`,
      10,
    );

    user.resetToken = verificationToken;

    this.userService.UpdateUser(user);
    await this.mailService.sendVerificationEmail(user.email, verificationToken);
    return this.messagehelper.SuccessResponse<boolean>('Email Resent!', true);
  }

  async login(
    userData: IUserLoginRequestData,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const user = await this.userModel.findOne({ email: userData.email }).exec();
    if (!user) throw new NotFoundException('User not registered');

    const isMatch = await bcrypt.compare(userData.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid Email or Password');

    const payload = {
      sub: user._id,
      userId: user.id,
      email: user.email,
      studioName: user.studioName,
      studioDescription: user.studioDescription,
      emailVerified: user.emailVerified,
      gamesInInventory: user.gamesInInventory,
      roles: user.roles,
    };
    const token = await this.jwtAuthService.generateToken(payload);

    return this.messagehelper.SuccessResponse<IUserLoginResponseData>(
      'Login success!',
      {
        email: user.email,
        id: user._id.toString(),
        userId: user.id.toString(),
        token: token,
      },
    );
  }

  async forgottenPassword(
    email: string,
  ): Promise<IMessageResponse<boolean | null>> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const resetToken = await bcrypt.hash(`${user.email}${Date.now()}`, 10);
    console.log(resetToken, 'RESET TOKEN');
    user.resetToken = resetToken;
    await this.userService.UpdateUser(user);

    await this.mailService.sendResetPasswordEmail(user.email, resetToken);

    return this.messagehelper.SuccessResponse<boolean>(
      'Reset password email has been sent, Check your Inbox!',
      true,
    );
  }

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
  ): Promise<IMessageResponse<boolean | null>> {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !user.resetToken)
      throw new BadRequestException('Invalid reset token');
    console.log(email, resetToken, newPassword, user.resetToken, 'HULA');
    const isTokenValid = resetToken === user.resetToken;
    if (!isTokenValid) throw new BadRequestException('Invalid reset token');
    const isMatch = await bcrypt.compare(newPassword, user.passwordHash);
    if (isMatch)
      throw new UnauthorizedException('You have used this password before!');
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    console.log(newPassword, newPasswordHash, user.passwordHash), 'CHECK';

    user.passwordHash = newPasswordHash;
    user.resetToken = null;
    await this.userService.UpdateUser(user);

    await this.userService.UpdatePassword(user);

    return this.messagehelper.SuccessResponse<boolean>(
      'Password has been reset',
      true,
    );
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<IMessageResponse<boolean | null>> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new Error('User not found');

    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash,
    );
    if (!isOldPasswordValid)
      throw new BadRequestException('Invalid old password');

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userService.UpdateUser(user);
    await this.userService.UpdatePassword(user);

    return this.messagehelper.SuccessResponse<boolean>(
      'Password has been changed',
      true,
    );
  }

  async verifyEmail(
    email: string,
    verificationToken: string,
  ): Promise<IMessageResponse<boolean | null>> {
    let message = 'Your Email has already been verified';
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    console.log(user.resetToken, verificationToken, 'CHECK');
    if (user.resetToken != null) {
      const isTokenValid = verificationToken === user.resetToken;
      console.log(isTokenValid, 'CHEKJC');
      if (!isTokenValid) throw new BadRequestException('Token not Valid');
      user.emailVerified = true;
      user.resetToken = null;
      await this.userService.UpdateUser(user);
      await this.userService.verifyEmail(user);
      message = 'Email has been verified';
    }

    return this.messagehelper.SuccessResponse<boolean>(message, true);
  }

  async logout(authTok: string): Promise<IMessageResponse<boolean | null>> {
    if (!authTok) throw new NotFoundException('No authentication token found');

    console.log(authTok, 'AuthToken');
    await this.jwtAuthService.invalidateToken(authTok);

    return this.messagehelper.SuccessResponse<boolean>(
      'Logout successful',
      true,
    );
  }

  async revokeJwtToken(
    token: string,
  ): Promise<IMessageResponse<boolean | null>> {
    const existingRevocation = await this.invalidTokens.findOne({ token });
    if (existingRevocation)
      throw new BadRequestException('Token has already been revoked');

    await this.invalidTokens.create({ token });

    return this.messagehelper.SuccessResponse<boolean>(
      'Token has been revoked',
      true,
    );
  }
}
