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
import { Response, Request } from 'express';
import { GameTitle } from 'src/models/gametitle.model';
import { MailService } from './mail.service';
import { GameTitleService } from './gameTitle.service';
import { BidHistory } from 'src/models/bidHistory.model';
import { BlockchainService } from './blockchain.service';

@Injectable()
export class AuctionsService {
  minBidIncrement: number = Number(process.env.MINIMUM_BID_INCREMENT);

  constructor(
    private messagehelper: MessageHelper,
    private mailService: MailService,
    private readonly notificationService: NotificationService,
    private readonly gameTitleService: GameTitleService,
    private readonly blockchainService: BlockchainService,

    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(GameTitle.name) private gameModel: Model<GameTitle>,

    @InjectModel(HighestBidder.name)
    private highestBidderModel: Model<HighestBidder>,

    @InjectModel(BidHistory.name)
    private bidHistoryModel: Model<BidHistory>,
  ) {}

  async startAuction(
    auctionData: IAuctionsRequestData,
    sellerEmail: string,
  ): Promise<IMessageResponse<{ auctionId: string } | null>> {
    // fetch params
    const newId = uuidv4();

    // const gameTitleCheck = await Auction.find({ gameTitleId: gameTitleId })
    // if (await gameTitleCheck.length > 0) throw new Error("Duplicate Auction Detected")

    // Make sure Game Title does not have an existing auction.
    const { gameTitleId, startTime, reservedPrice } = auctionData;

    const gameTitleData =
      await this.gameTitleService.findGameTitleById(gameTitleId);

    if (!gameTitleData && !gameTitleData.auction) {
      throw new UnauthorizedException(
        'game title doesnt exist or is not on auction',
      );
    }
    const endTimeThing = gameTitleData.auction.endTime;

    const gameFindResult = await this.auctionModel.find({ gameTitleId });
    if (gameFindResult) {
      gameFindResult.forEach((game) => {
        if (game.started)
          throw new NotAcceptableException('Duplicate Auction Detected!');
      });
    }

    //Make sure End time is greater than start Time
    if (new Date(endTimeThing).getTime() <= new Date(startTime).getTime())
      throw new UnauthorizedException(
        'Endtime must be greater than start Time',
      );

    const paramsPutAuction = new this.auctionModel({
      id: newId,
      gameTitleId,
      sellerEmail: gameTitleData.developerEmail,
      startTime: gameTitleData.auction.startTime,
      endTime: endTimeThing,
      reservedPrice: gameTitleData.auction.reservedPrice,
      started: true,
    });
    await paramsPutAuction.save();

    // fetch game Title Service and Include the auctionId to the Auction Field

    await this.gameTitleService.updateAuctionIdFieldInGameTitle(
      paramsPutAuction._id,
      paramsPutAuction.gameTitleId,
    );

    const paramsPutHighestBidder = new this.highestBidderModel({
      auctionId: paramsPutAuction._id,
      bid: 0,
      bidTime: 0,
      bidderEmail: '',
    });

    await paramsPutHighestBidder.save();

    // this.notificationService.notify(
    //   sellerEmail,
    //   null,
    //   paramsPutAuction._id.toString(),
    //   'Auction Start',
    //   0,
    //   'Auction',
    // );
    return this.messagehelper.SuccessResponse<{ auctionId: string }>(
      'Auction started successfully!',
      { auctionId: paramsPutAuction._id },
    );
  }

  async findAuctionById(auctionId: string): Promise<Auction> {
    const data = await this.auctionModel.findOne({ id: auctionId });
    return data;
  }

  async findAuctionByObjectId(auctionId: string): Promise<Auction> {
    const data = await this.auctionModel.findOne({ _id: auctionId });
    return data;
  }

  async findHighestBidderByAuctionId(
    auctionId: string,
  ): Promise<HighestBidder> {
    return await this.highestBidderModel.findOne({ auctionId });
  }

  async endAuction(
    auctionId: string,
    sellerEmail: string,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    // params get
    const paramsAuctionsGet = await this.auctionModel.findById(auctionId);
    if (!paramsAuctionsGet.started)
      throw new UnauthorizedException('This auction is not active');
    if (paramsAuctionsGet.sellerEmail != sellerEmail)
      throw new UnauthorizedException(
        'You are not the seller for this auction',
      );

    // params put

    // get auction
    // modify started on auction cancel
    paramsAuctionsGet.started = false;

    // put auction
    const paramsAuctionsPut = await this.auctionModel.updateOne(
      { id: auctionId },
      paramsAuctionsGet,
    );

    this.notificationService.notify(
      sellerEmail,
      null,
      paramsAuctionsGet._id.toString(),
      'Auction End',
      0,
      'Auction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Auction Ended successfully!',
      null,
    );
  }

  async placeBidOnAuction(
    auctionId: string,
    bidderEmail: string,
    bidAmountToPlace: number,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    if (!auctionId || !bidAmountToPlace) {
      throw new Error('auctionId or bidAmountToPlace Empty');
    }

    // declare minimumBid

    // get params
    const paramsAuctionsGet = await this.auctionModel.findById(auctionId);
    if (!paramsAuctionsGet) throw new NotFoundException('Cannot find Auction');
    if (!paramsAuctionsGet.started)
      throw new Error('This auction is not active');

    const paramsHighestGet = await this.highestBidderModel.findOne({
      auctionId,
    });
    if (!paramsHighestGet)
      throw new BadRequestException(
        'Missing bid data for auction: Auction is invalid',
      );
    // get auction

    // check to make sure date.now is less than endtime
    if (new Date(paramsAuctionsGet.endTime).getSeconds() > Date.now())
      throw new Error('Auction has ended');

    // make sure sender email is not seller email
    if (bidderEmail == paramsAuctionsGet.sellerEmail)
      throw new Error('You cannot bid on your own auction');

    // get highest bidder
    const highestBidder = paramsHighestGet;

    // get auction
    const auction = paramsAuctionsGet;

    // get min bid
    let minBid = highestBidder.bid;

    // if highest bid equals 0 let minBid be equals reservePrice + bidIncrement
    if (highestBidder.bid == 0) {
      minBid = auction.reservedPrice + this.minBidIncrement;
    }

    // make sure bid amount is greater than min bid
    if (bidAmountToPlace <= minBid)
      throw new UnauthorizedException('You must Outbid the highest bidder');

    // const data = await this.blockchainService.confirmAuctionBidPlacement(
    //   auction._id,
    //   bidAmountToPlace,
    // );

    // auction.paymentInfo.hasBuyerPaid = true;
    // auction.paymentInfo.BidderWalletAddress = data.bidder;

    if (highestBidder.bid > 0) {
      highestBidder.bid = 0;
    }

    const newHighestBidder = highestBidder;
    newHighestBidder.bid = bidAmountToPlace;
    newHighestBidder.bidderEmail = bidderEmail;
    newHighestBidder.sellerEmail = auction.sellerEmail;

    newHighestBidder.updatedAt = new Date();

    await newHighestBidder.save();

    //create Bid history
    const newBidHistory = new this.bidHistoryModel({
      bid: newHighestBidder.bid,
      bidderEmail: newHighestBidder.bidderEmail,
      updatedAt: newHighestBidder.updatedAt,
      auctionId: newHighestBidder.auctionId,
    });

    await newBidHistory.save();

    // notify user of bid
    this.notificationService.notify(
      newHighestBidder.bidderEmail,
      auction.sellerEmail,
      auction.id,
      'Bid was Placed',
      bidAmountToPlace,
      'Auction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Bid was placed successfully!',
      null,
    );
  }

  async resultAuction(
    auctionId: string,
    bidderEmail: string,
    txnHash: string,
  ): Promise<
    IMessageResponse<{
      bid: number;
      bidderEmail: string;
    }>
  > {
    // get params
    const auction = await this.auctionModel.findById(auctionId);
    const highestBidder = await this.highestBidderModel.findOne({
      auctionId,
    });

    const blockchainPaydetails =
      await this.blockchainService.confirmAuctionBidPlacement(
        auctionId,
        highestBidder.bid,
      );

    if (!auction)
      throw new NotFoundException('Not Found: Auction does not exist');

    if (blockchainPaydetails && blockchainPaydetails.hasBuyerPaid) {
      auction.paymentInfo = {
        ...auction.paymentInfo,
        transactionHash: txnHash,
        BidderWalletAddress: blockchainPaydetails.BidderWalletAddress,
        hasBuyerPaid: blockchainPaydetails.hasBuyerPaid,
      };
    }
    if (!auction.paymentInfo || !auction.paymentInfo.hasBuyerPaid) {
      throw new Error('Auction Hasnt been paid for');
    }

    if (!auction.started) throw new Error('This auction is not active');

    // check that auction hasn't ended with date time
    if (new Date(auction.endTime).getTime() > Date.now())
      throw new Error("Auction hasn't Ended yet");

    if (auction.sellerEmail == bidderEmail) {
      throw new Error(
        'You should not be placing a bid or paying for your own auction',
      );
    }

    auction.started = false;

    // transform auction resulted to true
    auction.resulted = true;

    auction.resulterEmail = bidderEmail;
    // transform buyer email to that of bidder email
    auction.buyerEmail = highestBidder.bidderEmail;

    // transfer Game Title to highest Bidder
    await this.gameTitleService.transferGameToNewOwner(
      auction.buyerEmail,
      auction.gameTitleId,
    );

    // put all putables
    await auction.save();

    this.notificationService.notify(
      auction.buyerEmail,
      auction.sellerEmail,
      auction._id.toString(),
      'Auction Result',
      0,
      'Auction',
    );

    //Send email to bidder reminding them to pay up
    this.mailService.sendNotificationEmail(
      auction.buyerEmail,
      'Auction has been Resulted you have seven days to pay up',
      process.env.FRONTEND_HOST + '/games/game-preview/' + auction.gameTitleId,
      'Auction Resulted',
    );

    // Innitiate a cron Job that  restarts the Auction
    // to a period of 7 days if payment isn't made in 7 days

    return this.messagehelper.SuccessResponse<{
      bid: number;
      bidderEmail: string;
    }>('Auction Resultance Successful!', {
      bid: highestBidder.bid,
      bidderEmail: highestBidder.bidderEmail,
    });
  }

  async confirmAuction(
    auctionId: string,
    bidderEmail: string,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    // get params
    const auction = await this.auctionModel.findOne({ _id: auctionId });
    const highestBidder = await this.highestBidderModel.findOne({
      auctionId: auctionId,
    });

    console.log(auction, 'AUCTION', auctionId);

    if (!auction) {
      throw new UnauthorizedException('Auction Does not exist');
    }

    if (!highestBidder) {
      throw new UnauthorizedException('Auction is Invalid');
    }

    if (new Date(auction.endTime).getSeconds() > Date.now())
      throw new Error('Auction has not ended');

    // make sure auction has been resulted
    if (!(await auction).resulted)
      throw new Error('Auction has not been resulted');

    // make sure bidder is the one confirming
    if (bidderEmail != highestBidder.bidderEmail)
      throw new Error('only the bidder is allowed to confirm auction');

    //make sure auction has been paid for
    if (!auction.paymentInfo) {
      throw new Error('Auction Hasnt been paid for');
    }

    if (!auction.paymentInfo.hasBuyerPaid)
      throw new UnauthorizedException('Buyer has not paid');

    // confirm payment receipt with payment service

    const highestBid = highestBidder.bid;
    highestBidder.bid = 0;

    //confirm that payment was made

    // confirm auction
    auction.confirmed = true;
    auction.reservedPrice = highestBid;
    // set data

    // let paramsSellerWalletPut = sellerWallet;

    // // const gameTitle = await this.gameModel.findOne({
    // //   _id: auction.gameTitleId,
    // // });
    // gameTitle.developerEmail = highestBidder.bidderEmail;
    // await gameTitle.save();

    //send Funds to seller

    await auction.save();

    await highestBidder.save();

    this.notificationService.notify(
      bidderEmail,
      auction.sellerEmail,
      auction._id.toString(),
      'Auction Confirmation',
      0,
      'Auction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Auction Confirmed',
      null,
    );
  }

  async fetchAuction(
    auctionId: string,
  ): Promise<IMessageResponse<Auction | null>> {
    const paramsAuctionGet = await this.auctionModel
      .findOne({ id: auctionId })
      .exec();

    return this.messagehelper.SuccessResponse<Auction>(
      'Fetch Successful!',
      paramsAuctionGet,
    );
  }

  async fetchAllAuctions(): Promise<IMessageResponse<Auction[]>> {
    const allAuctions = await this.auctionModel.find();

    return this.messagehelper.SuccessResponse<Auction[]>(
      'Fetch Successful!',
      allAuctions,
    );
  }

  async fetchUserAuctions({
    developerEmail,
  }: {
    developerEmail: string;
  }): Promise<IMessageResponse<Auction[]>> {
    const allAuctions = await this.auctionModel.find({
      sellerEmail: developerEmail,
    });

    return this.messagehelper.SuccessResponse<Auction[]>(
      'Fetch Successful!',
      allAuctions,
    );
  }

  async updateAuction(
    sellerEmail: string,
    auctionData: IAuctionsRequestData,
    auctionId: string,
  ): Promise<IMessageResponse<boolean>> {
    // fetch params
    const newId = uuidv4();

    // const gameTitleCheck = await Auction.find({ gameTitleId: gameTitleId })
    // if (await gameTitleCheck.length > 0) throw new Error("Duplicate Auction Detected")
    const { gameTitleId, startTime, endTime, reservedPrice } = auctionData;
    const auction = await this.auctionModel.findOne({ id: auctionId });
    auction.startTime = startTime;
    auction.endTime = endTime;
    auction.reservedPrice = reservedPrice;

    await auction.save();

    // this.notificationService.notify(
    //   sellerEmail,
    //   auctionId,
    //   'Auction Updated',
    //   0,
    //   'AuctionAction',
    // );

    return this.messagehelper.SuccessResponse<boolean>(
      'Auction Updated successfully!',
      true,
    );
  }

  async fetchMinimumBid(
    auctionId: string,
    request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    if (!auctionId) throw new UnauthorizedException('Auction Id not given ');
    const paramsHighestGet = await this.highestBidderModel.findOne({
      auctionId,
    });
    if (!paramsHighestGet)
      throw new UnauthorizedException('This Auction is Malformed');
    const auctionItem = await this.auctionModel.findOne({ _id: auctionId });
    console.log(auctionId, auctionItem, 'AUCJT');

    if (!paramsHighestGet)
      throw new UnauthorizedException('This Auction does not exist');

    console.log(auctionItem, 'AUCTION ITEM');
    let minBid;
    // get highest bidder
    if (auctionItem && auctionItem.reservedPrice) {
      const highestBidder = paramsHighestGet;
      minBid = highestBidder.bid + this.minBidIncrement;
      if (highestBidder.bid == 0) {
        minBid = auctionItem.reservedPrice + this.minBidIncrement;
      }
    } else {
      minBid = 0;
    }

    // get min bid

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Fetch Successful!',
      minBid,
    );
  }
}
