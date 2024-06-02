import { HydratedDocument, ObjectId } from 'mongoose';
import { GameTitle } from 'src/models/gametitle.model';
import { User, UserDocuments } from 'src/models/user.model';

export interface DatabaseConfig {
  host: string;
  port: number;
}

export interface IUser extends UserDocuments {
  studioName: string;
  studioDescription: string;
  email: string;
  resetToken: string;
  passwordHash: string;
  emailVerified: boolean;
  gamesInInventory: number;
}

export interface IUserRegisterRequestData {
  studioName: string;
  email: string;
  password: string;
}

export interface IGameTitleRequestData {
  token: string;
  developerEmail: string;
  gameFileLink: string;
  title: string;
  description: string;
  gamePlayScreenShots: string[];
  gamePlayVideo: string;
  genre: string;
  tags: string[];
  targetPlatform: string[];
  price: number;
  saleType: string;
  releaseDate: Date;
  legal: string;
  ageRating: string;
  developerId: string;
  gameRating: number;
  gamePlays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameTitleRequest {
  token: string;
  developerEmail: string;
  gameFileLink: string;
  title: string;
  description: string;
  gamePlayScreenShots: string[];
  gamePlayVideo: string;
  genre: string[];
  tags: string[];
  targetPlatform: string[];
  price: number;
  saleType: string;
  releaseDate: Date;
  legal: string;
  ageRating: string;
  developerId: string;
  gameRating: number;
  gamePlays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuctionsRequestData {
  auctionId: string;
  startTime: string;
  reservedPrice: string;
  endTime: string;
  gameTitleId: string;
  bidAmountToPlace: number;
}

export interface IAuctionsReponseData {
  auctionId: string;
  gameTitle: GameTitle;
}

export interface IUserRegisterResponseData {
  name: string;
  email: string;
  token?: string;
}

export interface IUserLoginRequestData {
  email: string;
  password: string;
}

export interface IUserLoginResponseData {
  email: string;
  token: string;
  id: string;
  userId: string;
}

export interface IMessageResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode?: number;
}

export interface IPassDatas {
  oldPassword: string;
  newPassword: string;
  userId: string;
}
