import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsController } from 'src/controllers/auctions/auctions.controller';
import { Auction, AuctionSchema } from 'src/models/auction.model';
import { BidHistory, BidHistorySchema } from 'src/models/bidHistory.model';
import {
  GameInventory,
  GameInventorySchema,
} from 'src/models/gameInventory.model';
import { GameTitle, GameTitleSchema } from 'src/models/gametitle.model';
import {
  HighestBidder,
  HighestBidderSchema,
} from 'src/models/highestBidder.model';
import {
  Notification,
  NotificationSchema,
} from 'src/models/notification.model';
import { Order, OrderSchema } from 'src/models/orders.model';
import { User, UserSchema } from 'src/models/user.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { AuctionsService } from 'src/providers/services/auctions.service';
import { BidsHistoryService } from 'src/providers/services/bidHistory.service';
import { BlockchainService } from 'src/providers/services/blockchain.service';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { MailService } from 'src/providers/services/mail.service';
import { NotificationService } from 'src/providers/services/notification.service';
import { OrderService } from 'src/providers/services/order.service';
import { PaymentService } from 'src/providers/services/payment.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([
      { name: HighestBidder.name, schema: HighestBidderSchema },
      { name: User.name, schema: UserSchema },
    ]),

    MongooseModule.forFeature([
      { name: GameTitle.name, schema: GameTitleSchema },
    ]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),

    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    MongooseModule.forFeature([
      { name: GameInventory.name, schema: GameInventorySchema },
    ]),

    MongooseModule.forFeature([
      { name: BidHistory.name, schema: BidHistorySchema },
    ]),

    // MongooseModule.forFeature([
    //   { name: Transaction.name, schema: TransactionSchema },
    // ]),
  ],
  controllers: [AuctionsController],
  providers: [
    MessageHelper,
    AuctionsService,
    NotificationService,
    MailService,
    GameTitleService,
    PaymentService,
    BlockchainService,
    OrderService,
    BidsHistoryService,
  ],
})
export class AuctionModule {}
