import {
  BadRequestException,
  Body,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseConfig,
  IAuctionsReponseData,
  IAuctionsRequestData,
  IMessageResponse,
  IPassDatas,
  IUserLoginRequestData,
  IUserLoginResponseData,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';

import { v4 as uuidv4 } from 'uuid';

import { User } from 'src/models/user.model';
import { MessageHelper } from '../helpers/messages.helpers';
import * as bcrypt from 'bcrypt';
import { MailService } from './mail.service';
import { UserService } from './user.service';
import { JwtAuthService } from './jwtAuth.service';
import { InvalidTokens } from 'src/models/InvalidTokens.model';
import { NotificationService } from './notification.service';
import { Auction } from 'src/models/auction.model';
import { HighestBidder } from 'src/models/highestBidder.model';
import { Response, Request } from 'express';
import { GameTitle } from 'src/models/gametitle.model';

@Injectable()
export class AuctionsService {
  minBidIncrement: number = Number(process.env.MINIMUM_BID_INCREMEN);

  constructor(
    private messagehelper: MessageHelper,
    private readonly mailService: MailService,
    private readonly jwtAuthService: JwtAuthService,

    private readonly userService: UserService,
    private readonly notificationService: NotificationService,

    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(GameTitle.name) private gameModel: Model<GameTitle>,

    @InjectModel(HighestBidder.name)
    private highestBidderModel: Model<HighestBidder>,
  ) {}

  async startAuction(
    request: Request,
    sellerEmail: string,
  ): Promise<IMessageResponse<{ auctionId: string } | null>> {
    // fetch params
    const newId = uuidv4();
    const { startTime, reservedPrice, endTime, gameTitleId } = request.body;

    // const gameTitleCheck = await Auction.find({ gameTitleId: gameTitleId })
    // if (await gameTitleCheck.length > 0) throw new Error("Duplicate Auction Detected")

    const paramsPutAuction = new Auction({
      shardId: process.env.SHARD_ID,
      id: newId,
      gameTitleId,
      sellerEmail,
      startTime,
      endTime,
      reservedPrice: reservedPrice,
      started: true,

      resulted: false,
      buyerEmail: null,
      confirmed: false,
    });
    await paramsPutAuction.save();

    const paramsPutHighestBidder = new this.highestBidderModel({
      shardId: process.env.SHARD_ID,
      auctionId: newId,
      bid: 0,
      bidTime: 0,
      bidderEmail: '',
    });

    await paramsPutHighestBidder.save();

    this.notificationService.notify(
      sellerEmail,
      paramsPutAuction._id.toString(),
      'Auction Start',
      0,
      'AuctionAction',
    );

    return this.messagehelper.SuccessResponse<{ auctionId: string }>(
      'Auction started successfully!',
      { auctionId: newId },
    );
  }

  async endAuction(
    auctionId: string,
    request: Request,
    sellerEmail: string,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    // params get
    const paramsAuctionsGet = await this.auctionModel.findOne({ auctionId });
    console.log(paramsAuctionsGet, 'GETTY');
    if (!paramsAuctionsGet.started)
      throw new Error('This auction is not active');
    if (paramsAuctionsGet.sellerEmail != sellerEmail)
      throw new Error('You are not the seller for this auction');

    // params put

    // get auction
    // modify started on auction cancel
    paramsAuctionsGet.started = false;
    console.log(paramsAuctionsGet.started, 'Started');

    // put auction
    const paramsAuctionsPut = await this.auctionModel.updateOne(
      { id: auctionId },
      paramsAuctionsGet,
    );

    console.log(paramsAuctionsPut);
    this.notificationService.notify(
      sellerEmail,
      paramsAuctionsGet._id.toString(),
      'Auction End',
      0,
      'AuctionAction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Auction Ended successfully!',
      null,
    );
  }

  async placeBidOnAuction(
    auctionId: string,
    request: Request,
    bidderEmail: string,
    bidAmountToPlace: number,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    if (!auctionId || !bidAmountToPlace) {
      throw new Error('auctionId or bidAmountToPlace Empty');
    }

    console.log(bidderEmail, 'Current Bidder');
    // declare minimumBid

    // get params
    const paramsAuctionsGet = await this.auctionModel.findOne({ auctionId });

    if (!paramsAuctionsGet.started)
      throw new Error('This auction is not active');

    const paramsHighestGet = await this.highestBidderModel.findOne({
      auctionId,
    });
    // const paramsGetFormerBidderWallet =
    //   paramsHighestGet.bid > 0
    //     ? await Wallet.findOne({ ownerEmail: paramsHighestGet.bidderEmail })
    //     : null;
    // const paramsGetCurrentBidderWallet = await Wallet.findOne({
    //   ownerEmail: bidderEmail,
    // });

    // put params
    // const paramsAuctionsPut = Auction.updateOne({ shardId: process.env.SHARD_ID, id: auctionId })
    // const paramsHighestPut = HighestBidder.updateOne({ shardId: process.env.SHARD_ID, auctionId: auctionId })
    // const paramsFormerBidderWalletPut = Wallet.updateOne({ shardId: process.env.SHARD_ID, ownerEmail: "" })
    // const paramsCurrentBidderWalletPut = Wallet.updateOne({ shardId: process.env.SHARD_ID, ownerEmail: bidderEmail })

    // get auction
    const getResultAuction = paramsAuctionsGet;

    // get highest bidder
    const getResultHighestBidder = paramsHighestGet;

    // get former highestBidders wallet
    // let getResultFormerBidderWallet = paramsGetFormerBidderWallet;

    // get former highestBidders wallet
    // let getResultCurrentBidderWallet = paramsGetCurrentBidderWallet;
    console.log(getResultAuction);

    // check to make sure date.now is less than endtime
    if (new Date(getResultAuction.endTime).getSeconds() > Date.now())
      throw new Error('Auction has ended');

    // make sure sender email is not seller email
    if (bidderEmail == getResultAuction.sellerEmail)
      throw new Error('You cannot bid on your own auction');

    // get highest bidder
    const highestBidder = getResultHighestBidder;

    // get auction
    const auction = getResultAuction;

    // get min bid
    let minBid = highestBidder.bid;

    // if highest bid equals 0 let minBid be equals reservePrice + bidIncrement
    if (highestBidder.bid == 0) {
      minBid = auction.reservedPrice + this.minBidIncrement;
    }

    // make sure bid amount is greater than min bid
    if (bidAmountToPlace < minBid)
      throw new Error('You must Outbid the highest bidder');

    // if highest bidders bid is greater than 0 transfer money back
    // get bidders wallet
    // let formerBidderWallet = getResultFormerBidderWallet;
    // let currentBidderWallet = getResultCurrentBidderWallet;

    if (highestBidder.bid > 0) {
      //check if this is the first bid, former bidder is empty string

      // return the former highest bidders cash
      // formerBidderWallet.balance += highestBidder.bid;

      // remove the money from bid
      highestBidder.bid = 0;
    }

    // make sure wallet balance is greater than bid amount
    // if (currentBidderWallet.balance < bidAmountToPlace)
    //   throw new Error('Insufficient Balance');
    // currentBidderWallet.balance -= bidAmountToPlace;
    // console.log(currentBidderWallet, bidAmountToPlace);
    // get new highest bidder
    const newHighestBidder = highestBidder;
    newHighestBidder.bid = bidAmountToPlace;
    newHighestBidder.bidderEmail = bidderEmail;
    const date = new Date();
    newHighestBidder.bidTime = date.getTime();
    console.log(
      newHighestBidder,
      newHighestBidder.bid,
      bidAmountToPlace,
      'SOMETHING COOL',
    );
    // update all transactions
    await this.highestBidderModel.updateOne(
      { auctionId: auction.id },
      newHighestBidder,
    );
    // if (formerBidderWallet)
    //   await Wallet.updateOne(
    //     { ownerEmail: formerBidderWallet.ownerEmail },
    //     formerBidderWallet,
    //   );
    // await Wallet.updateOne(
    //   { ownerEmail: currentBidderWallet.ownerEmail },
    //   currentBidderWallet,
    // );

    // notify user of bid
    this.notificationService.notify(
      newHighestBidder.bidderEmail,
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
    request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    console.log(auctionId, 'hola');
    // get params
    const paramsAuctionGet = await this.auctionModel.findOne({ id: auctionId });
    const paramsHighestBidderGet = await this.highestBidderModel.findOne({
      auctionId,
    });
    if (!paramsAuctionGet.started)
      throw new Error('This auction is not active');
    // put params
    const paramsAuctionsPut = { auction: null };

    // get auction
    const getResultAuction = paramsAuctionGet;
    const auction = getResultAuction;

    // get highest bidder
    const getResultHighestBidder = paramsHighestBidderGet;
    const highestBidder = getResultHighestBidder;

    // check that auction has started
    if (!auction.started) throw new Error("Auction hasn't started yet");

    // check that auction hasn't ended with date time
    if (new Date(auction.endTime).getSeconds() > Date.now())
      throw new Error("Auction hasn't started yet");

    // change game title owner: talk to game inventory
    // call api route /change game ownership

    // tranform auction start to false
    auction.started = false;

    // transform auction resulted to true
    auction.resulted = true;

    // transform buyer email to that of bidder email
    auction.buyerEmail = highestBidder.bidderEmail;

    paramsAuctionsPut.auction = auction;
    console.log(paramsAuctionsPut, 'AUCTION GET');

    // put all putables
    await this.auctionModel.updateOne(
      { auctionId: paramsAuctionsPut.auction.id },
      paramsAuctionsPut.auction,
    );

    this.notificationService.notify(
      auction.buyerEmail,
      paramsAuctionsPut.auction._id.toString(),
      'Auction Result',
      0,
      'AuctionAction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Fetch Successful!',
      null,
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
        bidTime: paramsHighestPut.bidTime,
        auctionId: paramsHighestPut.auctionId,
      },
    );

    this.notificationService.notify(
      bidderEmail,
      paramsAuctionsPut._id.toString(),
      'Auction Confirmation',
      0,
      'AuctionAction',
    );

    return this.messagehelper.SuccessResponse<IAuctionsReponseData>(
      'Fetch Successful!',
      null,
    );
  }

  async fetchAuction(
    auctionId: string,
    request: Request,
  ): Promise<IMessageResponse<GameTitle | null>> {
    const paramsAuctionGet = await this.auctionModel.findOne({ auctionId });
    const gameTitle = await this.gameModel.findOne({
      id: paramsAuctionGet.gameTitleId,
    });
    console.log(paramsAuctionGet);

    return this.messagehelper.SuccessResponse<GameTitle>(
      'Fetch Successful!',
      gameTitle,
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
