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
import { GameTitleResolver } from 'src/providers/graphql/gametitle/gametitles.resolver';
import { AuctionResolver } from 'src/providers/graphql/auctions/auctions.resolver';
import { AuctionsService } from 'src/providers/services/auctions.service';
import { MailService } from 'src/providers/services/mail.service';
import { NotificationService } from 'src/providers/services/notification.service';
import { Auction, AuctionSchema } from 'src/models/auction.model';
import {
  HighestBidder,
  HighestBidderSchema,
} from 'src/models/highestBidder.model';
import {
  Notification,
  NotificationSchema,
} from 'src/models/notification.model';
import {
  GameInventory,
  GameInventorySchema,
} from 'src/models/gameInventory.model';
import { GameInventoryResolver } from 'src/providers/graphql/gametitleInventory/gametitlesInventory.resolver';
import { BidHistory, BidHistorySchema } from 'src/models/bidHistory.model';
import { BidHistoryResolver } from 'src/providers/graphql/auctions/bids.resolver';
import { BidsHistoryService } from 'src/providers/services/bidHistory.service';
import { BlockchainService } from 'src/providers/services/blockchain.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GameTitle.name, schema: GameTitleSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: HighestBidder.name, schema: HighestBidderSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: GameInventory.name, schema: GameInventorySchema },
      { name: BidHistory.name, schema: BidHistorySchema },
      { name: HighestBidder.name, schema: HighestBidderSchema },
    ]),
  ],
  controllers: [GametitleController],
  providers: [
    UserService,
    MessageHelper,
    BidsHistoryService,
    GameTitleService,
    BidsHistoryService,
    GameTitleResolver,
    GameInventoryResolver,
    AuctionsService,
    MailService,
    AuctionResolver,
    BidHistoryResolver,
    NotificationService,
    BlockchainService,
    UserService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class GameTitleModule {}
