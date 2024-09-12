// src/game-inventory/schemas/game-title.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Plans } from './plans.model';

export type HighestBidderDocuments = HydratedDocument<GameTitle>;
@Schema()
export class GameTitle extends Document {
  @Prop({ unique: true })
  id: string;

  @Prop({ type: String })
  gameFileLink: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String] })
  gamePlayScreenShots: string[];

  @Prop({ type: String })
  gamePlayVideo: string;

  @Prop({ type: [String] })
  genre: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String] })
  targetPlatform: string[];

  @Prop({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop({ default: false })
  isOnSale: boolean;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String })
  saleType: string;

  @Prop({ default: new Date() })
  releaseDate: Date;

  @Prop({ type: String })
  legal: string;

  @Prop({ type: String })
  ageRating: string;

  @Prop({ type: String })
  developerId: string;

  @Prop({ type: String })
  developerEmail: string;

  @Prop({ type: Number })
  gameRating: number;

  @Prop({ type: Number })
  gamePlays: number;

  @Prop({ type: Number })
  gameReviews: number;

  @Prop({ type: Boolean })
  isCustomizationEnabled?: boolean;

  @Prop({ type: Number })
  customizationCharge?: number;

  @Prop({ type: Plans })
  plans?: Plans;

  @Prop({ type: Boolean })
  isAIAllowedPricing: boolean;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop()
  __v: number;
}

export const GameTitleSchema = SchemaFactory.createForClass(GameTitle);
