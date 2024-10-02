import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from 'src/controllers/rating/rating.controller';
import { Rating, RatingSchema } from 'src/models/rating.model';
import { RatingResolver } from 'src/providers/graphql/rating/rating.resolver';
import { RatingService } from 'src/providers/services/rating.service';
import { GameTitleModule } from './gametitle.module';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { GameTitle, GameTitleSchema } from 'src/models/gametitle.model';
import { User, UserSchema } from 'src/models/user.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import {
  GameInventory,
  GameInventorySchema,
} from 'src/models/gameInventory.model';
import { MailService } from 'src/providers/services/mail.service';
import { Auction, AuctionSchema } from 'src/models/auction.model';
import {
  HighestBidder,
  HighestBidderSchema,
} from 'src/models/highestBidder.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([
      { name: HighestBidder.name, schema: HighestBidderSchema },
    ]),

    MongooseModule.forFeature([
      { name: GameInventory.name, schema: GameInventorySchema },
    ]),

    MongooseModule.forFeature([
      { name: GameTitle.name, schema: GameTitleSchema },
    ]),
  ],
  controllers: [RatingController],
  providers: [
    RatingService,
    RatingResolver,
    GameTitleService,
    MessageHelper,
    MailService,
  ],
})
export class RatingModule {}
