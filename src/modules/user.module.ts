import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserController } from 'src/controllers/user/user.controller';
import { User, UserSchema } from 'src/models/user.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { UserService } from 'src/providers/services/user.service';
import { EarlyUser, EarlyUserSchema } from 'src/models/earlyUser.model';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: EarlyUser.name, schema: EarlyUserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    MessageHelper,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class UserModule {}
