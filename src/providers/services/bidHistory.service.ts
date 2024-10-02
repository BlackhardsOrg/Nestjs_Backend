import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IAuctionsReponseData,
  IAuctionsRequestData,
  IMessageResponse,
} from 'src/interfaces';

import { v4 as uuidv4 } from 'uuid';

import { MessageHelper } from '../helpers/messages.helpers';
import { NotificationService } from './notification.service';
import { Auction } from 'src/models/auction.model';
import { HighestBidder } from 'src/models/highestBidder.model';
import { GameTitle } from 'src/models/gametitle.model';
import { MailService } from './mail.service';
import { GameTitleService } from './gameTitle.service';
import { BidHistory } from 'src/models/bidHistory.model';

@Injectable()
export class BidsHistoryService {
  constructor(
    private messagehelper: MessageHelper,
    private mailService: MailService,
    private readonly notificationService: NotificationService,
    private readonly gameTitleService: GameTitleService,

    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(GameTitle.name) private gameModel: Model<GameTitle>,

    @InjectModel(HighestBidder.name)
    private highestBidderModel: Model<HighestBidder>,

    @InjectModel(BidHistory.name)
    private bidHistoryModel: Model<BidHistory>,
  ) {}

  async fetchSingleBidHistory(bidId: string): Promise<BidHistory> {
    const data = await this.bidHistoryModel.findOne({ id: bidId });
    return data;
  }

  async fetchAnAuctionHighestBidder(auctionId: string): Promise<HighestBidder> {
    const data = await this.highestBidderModel.findOne({
      auctionId: auctionId,
    });
    return data;
  }

  async fetchBidHistories(auctionId: string): Promise<BidHistory[]> {
    const data = await this.bidHistoryModel.find({ auctionId });
    return data;
  }

  async fetchUserBidHistories(bidderEmail: string): Promise<BidHistory[]> {
    const data = await this.bidHistoryModel.find({
      bidderEmail: bidderEmail,
    });
    return data;
  }
}
