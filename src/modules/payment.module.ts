import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from 'src/controllers/payment/payment.controller';
import { Auction, AuctionSchema } from 'src/models/auction.model';
import { GameTitle, GameTitleSchema } from 'src/models/gametitle.model';
import {
  HighestBidder,
  HighestBidderSchema,
} from 'src/models/highestBidder.model';
import { User, UserSchema } from 'src/models/user.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { PaymentService } from 'src/providers/services/payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GameTitle.name, schema: GameTitleSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: HighestBidder.name, schema: HighestBidderSchema },
    ]),
  ],
  providers: [PaymentService, GameTitleService, MessageHelper, ConfigService],
  controllers: [PaymentController],
})
export class PaymentModule {}
