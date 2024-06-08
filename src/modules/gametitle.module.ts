import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserController } from 'src/controllers/user/user.controller';
import { User, UserSchema } from 'src/models/user.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { UserService } from 'src/providers/services/user.service';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { GametitleController } from 'src/controllers/gametitle/gametitle.controller';
import { GameTitle, GameTitleSchema } from 'src/models/gametitle.model';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GameTitle.name, schema: GameTitleSchema },
    ]),
  ],
  controllers: [GametitleController],
  providers: [
    UserService,
    MessageHelper,
    GameTitleService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class GameTitleModule {}
