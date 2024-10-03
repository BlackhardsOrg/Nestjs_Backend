// src/game-inventory/game-inventory.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Gitlab, Projects } from '@gitbeaker/rest';
import axios, { AxiosResponse } from 'axios';
import { GameTitle } from 'src/models/gametitle.model';
import { v4 as uuidv4 } from 'uuid';
import {
  IAuctionGameTitleRequest,
  IGameData,
  IGameTitleRequest,
  IGameTitleRequestData,
  IMessageResponse,
  IPageArgs,
} from 'src/interfaces';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/models/user.model';
import { MessageHelper } from '../helpers/messages.helpers';
import { GameInventory } from 'src/models/gameInventory.model';
import { MailService } from './mail.service';
import { AuctionsService } from './auctions.service';
import { Auction } from 'src/models/auction.model';
import { HighestBidder } from 'src/models/highestBidder.model';

@Injectable()
export class GameTitleService {
  private readonly MONGO_URL =
    'mongodb+srv://vyra:Nor25rt@blackhardsserver.qe2hbmy.mongodb.net/?retryWrites=true&w=majority';
  lastGamePlays = Math.floor(Math.random() * 500000) + 1;
  lastCompetitorPricing = (Math.random() * 60).toFixed(2);
  lastCurrencyFluctuations = (Math.random() * 2).toFixed(2);
  constructor(
    @InjectModel(GameTitle.name) private gameTitleModel: Model<GameTitle>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,

    @InjectModel(GameInventory.name)
    private gameInventoryModel: Model<GameInventory>,

    @InjectModel(HighestBidder.name)
    private highestBidder: Model<HighestBidder>,

    private mailService: MailService,

    // private gitlabApi = new Gitlab({
    //   token: 'personaltoken',
    // }),
    // private projects = new Projects({
    //   host: 'http://example.com',
    //   token: 'personaltoken',
    // }),

    private readonly messageHelper: MessageHelper,
  ) {}

  async findGameTitleById(gameId: string): Promise<GameTitle | null> {
    //
    let data = await this.gameTitleModel.findById(gameId).exec();
    if (data && data.auctionId && data.auction) {
      const auction = await this.auctionModel.findById(data.auctionId);
      console.log(auction, 'AUCTION');
      if (auction) {
        if (!auction.isPayupEmailSent) {
          const highestBidder = await this.highestBidder.findOne({
            auctionId: auction._id,
          });
          console.log('GOT HERE');
          if (highestBidder.bidderEmail && auction.gameTitleId) {
            this.mailService.sendNotificationEmail(
              highestBidder.bidderEmail,
              'Auction has been Resulted you have seven days to pay up',
              'http://localhost:3000/games/game-preview/' + auction.gameTitleId,
              'Auction Resulted',
            );
          }

          auction.isPayupEmailSent = true;
          await auction.save();
        }
      }
    }

    if (data.isAIAllowedPricing) {
      await this.dynamicallyModifyGameTitleWithAI(data);
      data = await this.gameTitleModel.findById(gameId).exec();
    }

    return data;
  }

  async transferGameToNewOwner(
    newOwnerEmail: string,
    gameTitleId: string,
  ): Promise<boolean> {
    let success = false;
    const data = await this.gameTitleModel
      .updateOne({ _id: gameTitleId }, { developerEmail: newOwnerEmail })
      .exec();
    if (data.acknowledged) {
      success = true;
    }
    return success;
  }
  async updateAuctionIdFieldInGameTitle(
    auctionId: string,
    gameTitleId: string,
  ): Promise<{ auctionId: string; gameTitleId: string }> {
    const checkGameData = await this.gameTitleModel
      .findOne({ _id: gameTitleId })
      .exec();

    if (!checkGameData.auction)
      throw new UnauthorizedException('this is not an auction project');
    console.log(auctionId, 'Auction Update');
    const gameTitleData = await this.gameTitleModel.updateOne(
      { _id: gameTitleId },
      { auctionId: auctionId },
    );
    const checkGameDataConfirm = await this.gameTitleModel
      .findOne({ _id: gameTitleId })
      .exec();
    return {
      auctionId: checkGameDataConfirm.auctionId,
      gameTitleId: checkGameDataConfirm._id,
    };
  }

  async findGamesByIds(ids: string[]): Promise<GameTitle[]> {
    return this.gameTitleModel.find({ _id: { $in: ids } }).exec();
  }

  async findGameTitleByUserId(developerId: string): Promise<GameTitle | null> {
    return await this.gameTitleModel
      .findOne({ developerId: developerId })
      .select('-passwordHash -resetToken')
      .exec();
  }

  async findGameTitlesByDeveloperEmailAndGenre(
    email: string,
    pageArgs?: IPageArgs,
  ): Promise<GameTitle[] | null> {
    return await this.gameTitleModel
      .find({
        developerEmail: email,
        genre: { $in: [pageArgs.genre] },
      })
      .select('-tags')
      .skip(pageArgs.skip) // Skips the number of items
      .limit(pageArgs.take) // Limits the number of items to be returned
      .exec();
  }

  async findGameTitlesInInventoryByDeveloperEmail(
    buyerEmail: string,
    pageArgs?: IPageArgs,
  ): Promise<GameInventory[] | null> {
    return await this.gameInventoryModel
      .find({
        buyerEmail: buyerEmail,
        // genre: { $in: [pageArgs.genre] },
      })
      // .select('-tags')
      .skip(pageArgs.skip) // Skips the number of items
      .limit(pageArgs.take) // Limits the number of items to be returned
      .exec();
  }

  async addGameToInventory(
    gameInventoryData: IGameData,
  ): Promise<IMessageResponse<boolean>> {
    let success = false;
    const currentGame = await this.gameInventoryModel.findOne({
      gameId: gameInventoryData.gameId,
    });
    if (currentGame) {
      throw new NotFoundException('Game is already in inventory');
    }
    const newGameTitleInventory = new this.gameInventoryModel({
      gameId: gameInventoryData.gameId,
      buyerEmail: gameInventoryData.buyerEmail,
      packageType: gameInventoryData.packageType,
      packageTypeGameLink: gameInventoryData.packageTypeGameLink,
    });

    await newGameTitleInventory.save();
    success = true;
    return this.messageHelper.SuccessResponse(
      'Game added to Inventory',
      success,
    );
  }

  async createGameTitle(
    gameTitleData: IGameTitleRequestData,
  ): Promise<IMessageResponse<boolean>> {
    const user = await this.userModel
      .findOne({ email: gameTitleData.developerEmail })
      .exec();
    user.gamesInInventory += 1;
    await user.save();

    const gameTitle = new this.gameTitleModel({
      id: uuidv4(),
      developerEmail: gameTitleData.developerEmail,
      gameFileLink: gameTitleData.gameFileLink,
      title: gameTitleData.title,
      description: gameTitleData.description,
      gamePlayScreenShots: gameTitleData.gamePlayScreenShots,
      gamePlayVideo: gameTitleData.gamePlayVideo,
      genre: gameTitleData.genre,
      tags: gameTitleData.tags,
      targetPlatform: gameTitleData.targetPlatform,
      price: gameTitleData.price,
      saleType: gameTitleData.saleType,
      auction: gameTitleData.auction,
      releaseDate: gameTitleData.releaseDate,
      legal: gameTitleData.legal,
      ageRating: gameTitleData.ageRating,
      developerId: gameTitleData.developerId,
      plans: gameTitleData.plans,
      isAIAllowedPricing: gameTitleData.isAIAllowedPricing,
      isApproved: false,
      isOnSale: false,
      gameRating: 1,
      gamePlays: 0,
      __v: 0,
    });

    await gameTitle.save();

    return this.messageHelper.SuccessResponse(
      'Game Title Creation Successful!',
      true,
    );
  }

  async createAuctionGameTitle(
    auctionGameTitleData: IAuctionGameTitleRequest,
  ): Promise<IMessageResponse<{ gameTitleId: string }>> {
    const user = await this.userModel
      .findOne({ email: auctionGameTitleData.developerEmail })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    user.gamesInInventory += 1;

    await user.save();

    const auctionGameTitle = new this.gameTitleModel({
      id: uuidv4(),
      developerEmail: auctionGameTitleData.developerEmail,
      gameFileLink: auctionGameTitleData.gameFileLink,
      title: auctionGameTitleData.title,
      description: auctionGameTitleData.description,
      gamePlayScreenShots: auctionGameTitleData.gamePlayScreenShots,
      gamePlayVideo: auctionGameTitleData.gamePlayVideo,
      genre: auctionGameTitleData.genre,
      tags: auctionGameTitleData.tags,
      targetPlatform: auctionGameTitleData.targetPlatform,
      price: auctionGameTitleData.price,
      saleType: auctionGameTitleData.saleType,
      releaseDate: auctionGameTitleData.releaseDate,
      legal: auctionGameTitleData.legal,
      ageRating: auctionGameTitleData.ageRating,
      developerId: auctionGameTitleData.developerId,
      isApproved: false,
      isOnSale: false,
      gameRating: 1,
      gamePlays: 0,
      __v: 0,
    });

    await auctionGameTitle.save();

    return this.messageHelper.SuccessResponse(
      'Game Title Creation Successful!',
      { gameTitleId: auctionGameTitle._id },
    );
  }

  async updateGameTitle(
    id: string,
    updateData: IGameTitleRequestData,
  ): Promise<IMessageResponse<boolean>> {
    const gameTitle = await this.findGameTitleById(id);
    if (!gameTitle) {
      throw new Error('Game title not found');
    }

    gameTitle.gameFileLink = updateData.gameFileLink
      ? updateData.gameFileLink
      : gameTitle.gameFileLink;
    gameTitle.title = updateData.title ? updateData.title : gameTitle.title;
    gameTitle.description = updateData.description
      ? updateData.description
      : gameTitle.description;
    gameTitle.gamePlayScreenShots = updateData.gamePlayScreenShots
      ? updateData.gamePlayScreenShots
      : gameTitle.gamePlayScreenShots;
    gameTitle.gamePlayVideo = updateData.gamePlayVideo
      ? updateData.gamePlayVideo
      : gameTitle.gamePlayVideo;
    gameTitle.genre = updateData.genre ? updateData.genre : gameTitle.genre;
    gameTitle.tags = updateData.tags ? updateData.tags : gameTitle.tags;
    gameTitle.targetPlatform = updateData.targetPlatform
      ? updateData.targetPlatform
      : gameTitle.targetPlatform;
    gameTitle.price = updateData.price ? updateData.price : gameTitle.price;
    gameTitle.saleType = updateData.saleType
      ? updateData.saleType
      : gameTitle.saleType;
    gameTitle.releaseDate = updateData.releaseDate
      ? updateData.releaseDate
      : gameTitle.releaseDate;
    gameTitle.legal = updateData.legal ? updateData.legal : gameTitle.legal;
    gameTitle.auction = updateData.auction
      ? updateData.auction
      : gameTitle.auction;

    gameTitle.ageRating = updateData.ageRating
      ? updateData.ageRating
      : gameTitle.ageRating;
    gameTitle.developerId = updateData.developerId
      ? updateData.developerId
      : gameTitle.developerId;
    gameTitle.developerEmail = updateData.developerEmail
      ? updateData.developerEmail
      : gameTitle.developerEmail;
    gameTitle.gameRating = updateData.gameRating
      ? updateData.gameRating
      : gameTitle.gameRating;
    gameTitle.gamePlays = updateData.gamePlays
      ? updateData.gamePlays
      : gameTitle.gamePlays;
    // Object.assign(gameTitle, updateData);
    gameTitle.updatedAt = new Date();
    await gameTitle.save();
    return this.messageHelper.SuccessResponse(
      'Game Updated Successfully!',
      true,
    );
  }

  async deleteGameTitle(id: string): Promise<IMessageResponse<boolean>> {
    const gameTitle = await this.findGameTitleById(id);
    if (!gameTitle) {
      throw new Error('Game title not found');
    }

    //DO storage clean up

    // Delete Game
    await gameTitle.deleteOne();
    return this.messageHelper.SuccessResponse(
      'Game Title Deleted successfully',
      true,
    );
  }

  async fetchGameTitle(id: string): Promise<IMessageResponse<GameTitle>> {
    const gameTitle = await this.findGameTitleById(id);
    if (!gameTitle) {
      throw new NotFoundException('Game title not found');
    }

    return this.messageHelper.SuccessResponse('Fetch Game Title', gameTitle);
  }

  async fetchUserGameTitles(
    developerEmail: string,
  ): Promise<IMessageResponse<GameTitle[]>> {
    return this.messageHelper.SuccessResponse(
      'User Game Data Fetched Successfully',
      await this.findGameTitlesByDeveloperEmailAndGenre(developerEmail),
    );
  }

  async fetchAllGameTitles(
    pageArgs?: IPageArgs,
  ): Promise<IMessageResponse<GameTitle[]>> {
    const query: any = {};

    // Filter by genre (if provided)
    if (pageArgs.genre) {
      query.genre = { $in: [pageArgs.genre] };
    }

    // Filter by price range (if provided)
    if (pageArgs.priceMin !== undefined || pageArgs.priceMax !== undefined) {
      query['plans.basic.price'] = {};

      if (pageArgs.priceMin !== undefined) {
        query['plans.basic.price'].$gte = pageArgs.priceMin;
      }
      if (pageArgs.priceMax !== undefined) {
        query['plans.basic.price'].$lte = pageArgs.priceMax;
      }
    }

    // Filter by rating (allowing for a rating range if needed)
    if (pageArgs.rating !== undefined) {
      query.gameRating = {
        $gte: pageArgs.rating - 0.5, // Allows games 1 rating below
        $lte: pageArgs.rating + 0.5, // Allows games 1 rating above
      };
    }

    // Filter by tag (if provided)
    if (pageArgs.tag) {
      query.tags = { $in: [pageArgs.tag] };
    }
    console.log(query, 'QUERY');
    return this.messageHelper.SuccessResponse(
      'User Game Data Fetched Successfully',
      await this.gameTitleModel
        .find(query) // Use the constructed query here
        // .select('-tags')
        // .skip(pageArgs.skip) // Skips the number of items
        // .limit(pageArgs.take) // Limits the number of items to be returned
        .exec(),
    );
  }

  async approveGameTitle(gameId: string): Promise<IMessageResponse<boolean>> {
    const gameTitle = await this.findGameTitleById(gameId);
    gameTitle.isApproved = true;
    await gameTitle.save();
    return this.messageHelper.SuccessResponse('Game Title Approved', true);
  }

  async disApproveGameTitle(
    gameId: string,
  ): Promise<IMessageResponse<boolean>> {
    const gameTitle = await this.findGameTitleById(gameId);
    gameTitle.isApproved = false;
    await gameTitle.save();
    return this.messageHelper.SuccessResponse('Game Title DisAppoved', true);
  }

  async listGameTitle(gameId: string): Promise<IMessageResponse<boolean>> {
    const gameTitle = await this.findGameTitleById(gameId);
    gameTitle.isOnSale = true;
    await gameTitle.save();
    return this.messageHelper.SuccessResponse(
      'Game Title Listed on Marketplace',
      true,
    );
  }

  async unListGameTitle(gameId: string): Promise<IMessageResponse<boolean>> {
    const gameTitle = await this.findGameTitleById(gameId);
    gameTitle.isOnSale = false;
    await gameTitle.save();
    return this.messageHelper.SuccessResponse(
      'Game Title Delisted from Marketplace',
      true,
    );
  }

  async dynamicallyModifyGameTitleWithAI(
    gameTitle: GameTitle,
  ): Promise<IMessageResponse<boolean>> {
    // const gameTitle = await this.findGameTitleById(gameId);
    try {
      console.log(gameTitle.genre[0], gameTitle.targetPlatform[0], 'HALOSNNS');
      const generatedData = {
        genre: gameTitle.genre[0],
        targetPlatform: gameTitle.targetPlatform[0],
        ...this.generateStableGameData(),
      };
      console.log(generatedData, 'GENERATED DATA');
      const data = await axios.post(
        'https://ositamiles-blackhards.hf.space/predict_price/',
        generatedData,
      );
      const basicPrice = Number(data.data.predicted_price.split('$')[1]);
      const standardPrice =
        (25 / 100) * Number(basicPrice) + Number(basicPrice);
      const premiumPrice =
        (25 / 100) * Number(standardPrice) + Number(standardPrice);

      console.log(basicPrice, standardPrice, premiumPrice);

      if (gameTitle.plans && basicPrice) {
        gameTitle.plans.basic.price = basicPrice;
        gameTitle.plans.standard.price = standardPrice;
        gameTitle.plans.premium.price = premiumPrice;
        await gameTitle.save();
      }

      if (!gameTitle.plans) {
        gameTitle.price = basicPrice;
        await gameTitle.save();
      }

      if (gameTitle && gameTitle.auction && gameTitle.auctionId) {
        gameTitle.auction.reservedPrice = basicPrice;
      }

      console.log(data, 'DATA', data.data.predicted_price.split('$')[1]);

      // await gameTitle.save();
      return this.messageHelper.SuccessResponse(
        'Game Title Delisted from Marketplace',
        true,
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  generateStableGameData() {
    const gamePlays = Math.floor(
      this.lastGamePlays + (Math.random() * 1000000 - 500000),
    ); // Small fluctuation
    const competitorPricing = (
      parseFloat(this.lastCompetitorPricing) +
      (Math.random() * 10 - 5)
    ).toFixed(2); // Small fluctuation
    const currencyFluctuations = (
      parseFloat(this.lastCurrencyFluctuations) +
      (Math.random() * 0.05 - 0.025)
    ).toFixed(2); // Small fluctuation

    // Update last values to smooth changes over time
    this.lastGamePlays = gamePlays;
    this.lastCompetitorPricing = competitorPricing;
    this.lastCurrencyFluctuations = currencyFluctuations;

    return {
      gamePlays: Math.max(0, gamePlays), // Ensure gamePlays is positive
      competitorPricing: Math.max(0, parseFloat(competitorPricing)), // Ensure price is positive
      currencyFluctuations: Math.max(0, parseFloat(currencyFluctuations)), // Ensure no negative values
    };
  }
}
