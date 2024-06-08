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

@Injectable()
export class AuctionsService {
  minBidIncrement: number = Number(process.env.MINIMUM_BID_INCREMENT);

  constructor(
    private messagehelper: MessageHelper,

    private readonly notificationService: NotificationService,
    // private readonly gameTitleService: GameTitleService,

    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(GameTitle.name) private gameModel: Model<GameTitle>,

    @InjectModel(HighestBidder.name)
    private highestBidderModel: Model<HighestBidder>,
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
    const { gameTitleId, startTime, endTime, reservedPrice } = auctionData;

    const gameFindResult = await this.auctionModel.find({ gameTitleId });
    if (gameFindResult) {
      gameFindResult.forEach((game) => {
        if (game.started)
          throw new NotAcceptableException('Duplicate Auction Detected!');
      });
    }

    //Make sure End time is greater than start Time
    if (new Date(endTime).getTime() <= new Date(startTime).getTime())
      throw new UnauthorizedException(
        'Endtime must be greater than start Time',
      );

    const paramsPutAuction = new this.auctionModel({
      id: newId,
      gameTitleId,
      sellerEmail,
      startTime,
      endTime,
      reservedPrice,
      started: true,
    });
    await paramsPutAuction.save();

    const paramsPutHighestBidder = new this.highestBidderModel({
      auctionId: paramsPutAuction._id,
      bid: 0,
      bidTime: 0,
      bidderEmail: '',
    });

    await paramsPutHighestBidder.save();

    this.notificationService.notify(
      sellerEmail,
      null,
      paramsPutAuction._id.toString(),
      'Auction Start',
      0,
      'Auction',
    );

    return this.messagehelper.SuccessResponse<{ auctionId: string }>(
      'Auction started successfully!',
      { auctionId: paramsPutAuction._id },
    );
  }

  async endAuction(
    auctionId: string,
    sellerEmail: string,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    // params get
    const paramsAuctionsGet = await this.auctionModel.findById(auctionId);
    console.log(paramsAuctionsGet, 'GETTY');
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
    console.log(paramsAuctionsGet.started, 'Ended');

    // put auction
    const paramsAuctionsPut = await this.auctionModel.updateOne(
      { id: auctionId },
      paramsAuctionsGet,
    );

    console.log(paramsAuctionsPut);
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

    console.log(bidderEmail, 'Current Bidder');
    // declare minimumBid

    // get params
    const paramsAuctionsGet = await this.auctionModel.findById(auctionId);
    console.log(paramsAuctionsGet, 'STARTED', paramsAuctionsGet);
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

    console.log(paramsAuctionsGet);

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

    console.log(bidAmountToPlace, minBid, 'LOIGIC/*  */', this.minBidIncrement);
    // make sure bid amount is greater than min bid
    if (bidAmountToPlace <= minBid)
      throw new UnauthorizedException('You must Outbid the highest bidder');

    if (highestBidder.bid > 0) {
      highestBidder.bid = 0;
    }

    const newHighestBidder = highestBidder;
    newHighestBidder.bid = bidAmountToPlace;
    newHighestBidder.bidderEmail = bidderEmail;
    newHighestBidder.updatedAt = new Date();
    console.log(newHighestBidder);

    await newHighestBidder.save();

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
    resulterEmail: string,
  ): Promise<IMessageResponse<boolean>> {
    console.log(auctionId, 'hola');
    // get params
    const auction = await this.auctionModel.findById(auctionId);
    const highestBidder = await this.highestBidderModel.findOne({
      auctionId,
    });
    if (!auction)
      throw new NotFoundException('Not Found: Auction does not exist');
    if (!auction.started) throw new Error('This auction is not active');

    // check that auction has started
    if (!auction.started) throw new Error("Auction hasn't started yet");

    // check that auction hasn't ended with date time
    if (new Date(auction.endTime).getTime() > Date.now())
      throw new Error("Auction hasn't Ended yet");

    auction.started = false;

    // transform auction resulted to true
    auction.resulted = true;

    auction.resulterEmail = resulterEmail;
    // transform buyer email to that of bidder email
    auction.buyerEmail = highestBidder.bidderEmail;

    // put all putables
    const result = await auction.save();
    console.log(auction, 'AUCTION GET', result);

    this.notificationService.notify(
      auction.buyerEmail,
      auction.sellerEmail,
      auction._id.toString(),
      'Auction Result',
      0,
      'Auction',
    );

    //Send email to bidder reminding them to pay up

    return this.messagehelper.SuccessResponse<boolean>(
      'Auction Resultance Successful!',
      true,
    );
  }

  async confirmAuction(
    auctionId: string,
    request: Request,
    bidderEmail: string,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    // get params
    const paramsAuctionsGet = await this.auctionModel.findOne({ auctionId });
    const paramsHighestGet = await this.highestBidderModel.findOne({
      auctionId: auctionId,
    });
    // const paramsGetCurrentBidderWallet = await Wallet.findOne({
    //   ownerEmail: bidderEmail,
    // });
    // const paramsGetSelletWallet = await Wallet.findOne({
    //   ownerEmail: paramsAuctionsGet.sellerEmail,
    // });
    // if (!paramsAuctionsGet.started) throw new Error("This auction is not active")

    // get auction
    const getResultAuction = paramsAuctionsGet;

    // get highest bidder
    const getResultHighestBidder = paramsHighestGet;

    // get current highestBidders wallet
    // let getResultCurrentBidderWallet = paramsGetCurrentBidderWallet;
    // let currentBidderWallet = getResultCurrentBidderWallet;

    // get highest bidder
    const highestBidder = getResultHighestBidder;

    // get current highestBidders wallet
    // let getResultSellerWallet = paramsGetSelletWallet;
    // let sellerWallet = getResultSellerWallet;

    // get auction
    const auction = getResultAuction;

    // check to make sure date.now is less than endtime
    if (new Date(getResultAuction.endTime).getSeconds() > Date.now())
      throw new Error('Auction has not ended');

    // make sure auction has been resulted
    if (!(await getResultAuction).resulted)
      throw new Error('Auction has not been resulted');

    // make sure bidder is the one confirming
    if (bidderEmail != highestBidder.bidderEmail)
      throw new Error('only the bidder is allowed to confirm auction');
    // transfer money to seller and deduct from buy wallet
    // sellerWallet.balance += highestBidder.bid;
    // sellerWallet.ownerEmail = auction.sellerEmail;
    const highestBid = highestBidder.bid;
    highestBidder.bid = 0;

    // confirm auction
    auction.confirmed = true;

    // set data
    const paramsAuctionsPut = auction;
    const paramsHighestPut = highestBidder;

    // let paramsSellerWalletPut = sellerWallet;

    const gameTitle = await this.gameModel.findOne({
      _id: paramsAuctionsGet.gameTitleId,
    });
    gameTitle.developerEmail = highestBidder.bidderEmail;

    // put all putables
    await this.auctionModel.updateOne(
      { id: auctionId },
      {
        id: paramsAuctionsPut.id,
        gameTitleId: paramsAuctionsPut.gameTitleId,
        sellerEmail: paramsAuctionsPut.sellerEmail,
        startTime: paramsAuctionsPut.startTime,
        endTime: paramsAuctionsPut.endTime,
        reservedPrice: highestBid,
        started: paramsAuctionsPut.started,
        resulted: paramsAuctionsPut.resulted,
        buyerEmail: paramsAuctionsPut.buyerEmail,
        confirmed: paramsAuctionsPut.confirmed,
      },
    );
    await this.gameModel.updateOne(
      { _id: paramsAuctionsGet.gameTitleId },
      gameTitle,
    );

    await this.highestBidderModel.updateOne(
      { auctionId: auctionId },
      {
        bidderEmail: paramsHighestPut.bidderEmail,
        bid: paramsHighestPut.bid,
        updatedAt: paramsHighestPut.updatedAt,
        auctionId: paramsHighestPut.auctionId,
      },
    );

    this.notificationService.notify(
      bidderEmail,
      paramsAuctionsPut.sellerEmail,
      paramsAuctionsPut._id.toString(),
      'Auction Confirmation',
      0,
      'Auction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Fetch Successful!',
      null,
    );
  }

  async fetchAuction(
    auctionId: string,
  ): Promise<IMessageResponse<Auction | null>> {
    const paramsAuctionGet = await this.auctionModel.findById(auctionId);

    console.log(paramsAuctionGet);

    return this.messagehelper.SuccessResponse<Auction>(
      'Fetch Successful!',
      paramsAuctionGet,
    );
  }

  async fetchAllAuctions(): Promise<IMessageResponse<Auction[]>> {
    const allAuctions = await this.auctionModel.find();

    console.log(allAuctions);

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
    const paramsHighestGet = await this.highestBidderModel.findOne({
      auctionId,
    });
    const auctionItem = await this.auctionModel.findOne({ auctionId });
    let minBid;
    // get highest bidder
    const highestBidder = paramsHighestGet;
    minBid = highestBidder.bid + this.minBidIncrement;
    if (highestBidder.bid == 0) {
      minBid = auctionItem.reservedPrice + this.minBidIncrement;
    }
    console.log(auctionId, paramsHighestGet, 'HELLO WORLD');

    // get min bid

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Fetch Successful!',
      minBid,
    );
  }
}
