import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsController } from 'src/controllers/auctions/auctions.controller';
import { Auction, AuctionSchema } from 'src/models/auction.model';
import { GameTitle, GameTitleSchema } from 'src/models/gametitle.model';
import {
  HighestBidder,
  HighestBidderSchema,
} from 'src/models/highestBidder.model';
import {
  Notification,
  NotificationSchema,
} from 'src/models/notification.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { AuctionsService } from 'src/providers/services/auctions.service';
import { NotificationService } from 'src/providers/services/notification.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([
      { name: HighestBidder.name, schema: HighestBidderSchema },
    ]),

    MongooseModule.forFeature([
      { name: GameTitle.name, schema: GameTitleSchema },
    ]),

    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),

    // MongooseModule.forFeature([
    //   { name: Transaction.name, schema: TransactionSchema },
    // ]),
  ],
  controllers: [AuctionsController],
  providers: [MessageHelper, AuctionsService, NotificationService],
})
export class AuctionModule {}
