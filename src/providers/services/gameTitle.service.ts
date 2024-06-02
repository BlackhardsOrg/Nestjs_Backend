// src/game-inventory/game-inventory.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import { GameTitle } from 'src/models/gametitle.model';
import {
  IGameTitleRequest,
  IGameTitleRequestData,
  IMessageResponse,
} from 'src/interfaces';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/models/user.model';
import { MessageHelper } from '../helpers/messages.helpers';

@Injectable()
export class GameTitleService {
  private readonly MONGO_URL =
    'mongodb+srv://vyra:Nor25rt@blackhardsserver.qe2hbmy.mongodb.net/?retryWrites=true&w=majority';

  constructor(
    @InjectModel(GameTitle.name) private gameTitleModel: Model<GameTitle>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private httpService: HttpService,
    private readonly messageHelper: MessageHelper,
  ) {}

  async findGameTitleById(gameId: string): Promise<GameTitle | null> {
    return await this.gameTitleModel.findById(gameId).exec();
  }

  async findGameTitleByUserId(developerId: string): Promise<GameTitle | null> {
    return await this.gameTitleModel
      .findOne({ developerId: developerId })
      .select('-passwordHash -resetToken')
      .exec();
  }

  async findGameTitlesByDeveloperEmail(
    email: string,
  ): Promise<GameTitle[] | null> {
    return await this.gameTitleModel
      .find({ developerEmail: email })
      .select('-tags')
      .exec();
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
      id: new this.gameTitleModel()._id.toString(),
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
      releaseDate: gameTitleData.releaseDate,
      legal: gameTitleData.legal,
      ageRating: gameTitleData.ageRating,
      developerId: gameTitleData.developerId,
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

  async updateGameTitle(
    id: string,
    updateData: Partial<IGameTitleRequest>,
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
      throw new Error('Game title not found');
    }

    return this.messageHelper.SuccessResponse('Fetch Game Title', gameTitle);
  }

  async fetchUserGameTitles(
    developerEmail: string,
  ): Promise<IMessageResponse<GameTitle[]>> {
    return this.messageHelper.SuccessResponse(
      'User Game Data Fetched Successfully',
      await this.findGameTitlesByDeveloperEmail(developerEmail),
    );
  }

  async fetchAllGameTitles(): Promise<IMessageResponse<GameTitle[]>> {
    return this.messageHelper.SuccessResponse(
      'User Game Data Fetched Successfully',
      await this.gameTitleModel.find().exec(),
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
      'Game Title Listed from Marketplace',
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
}
