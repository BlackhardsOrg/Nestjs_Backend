import { HydratedDocument, ObjectId } from 'mongoose';
import { GameTitle } from 'src/models/gametitle.model';
import { Rating } from 'src/models/rating.model';
import { User, UserDocuments } from 'src/models/user.model';

export interface DatabaseConfig {
  host: string;
  port: number;
}

export interface IPageArgs {
  skip: number;
  take: number;
  genre?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  tag?: string;
  developerEmail?: string;
}

export interface IUser extends UserDocuments {
  profileImageURL: string;
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

export interface IUserRegisterEarlyRequestData {
  studioName: string;
  password: string;
  country: string;
  email: string;
  yourPurpose: string;
  portfolioLink: string;
  yourRole: string;
}

export interface IGameTitleRequestData {
  id: string;
  token: string;
  developerEmail: string;
  demoLink: string;
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

  isCustomizationEnabled?: boolean;
  customizationCharge?: number;
  plans?: IPlans;
  isAIAllowedPricing: boolean;
  createdAt: Date;
  updatedAt: Date;
  auction?: IAuction;
}

export interface IAuction {
  endTime: string;
  reservedPrice: number;
  startTime: string;
}

// ffdfdfd

export interface IPlan {
  type: 'basic' | 'standard' | 'premium';
  price: number;
  title: string;
  howLongToLaunch: number;

  howManyCustomizations: number;
  customizationCharge: number;

  howManyLevels: number;

  hasDocumentation: boolean;

  hasAdminPanel: boolean;
}

export interface IPlans {
  basic: IPlan;
  standard: IPlan;
  premium: IPlan;
}

//fedfdfdfd

export interface IGameTitleRequest {
  id: string;
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
  reservedPrice: number;
  endTime: string;
  gameTitleId: string;
  bidAmountToPlace: number;
  txnHash?: string;
}

export interface IAuctionGameTitleRequest extends IAuctionsRequestData {
  id: string;
  token: string;
  demoLink: string;
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

export interface IAuctionsReponseData {
  auctionId: string;
  gameTitle: GameTitle;
}

export interface IMailData {
  name: string;
  role: string;
  email: string;
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
  studioName: string;
  studioDescription: string;
  emailVerified: boolean;
  gamesInInventory: number;
  roles: string[];
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

export interface IOrder {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  houseNo: string;
  streetName: string;
  town: string;
  state: string;
  zip: string;
  phone: string;
  additionalInfo: string;
  paymentType: string;
  totalAmount: number;
  email: string;
  GamePackageAndIds: IGamePackageIDs[];
  isFulfilled?: boolean;
  walletAddress?: string;
}

export interface IGamePackageIDs {
  id: string;
  packageType: string;
  title?: string;
  price?: string | number;
}

export interface IGameData {
  gameId: string;
  buyerEmail: string;
  packageType: string;
  packageTypeGameLink: string;
}
