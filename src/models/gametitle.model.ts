// src/game-inventory/schemas/game-title.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type HighestBidderDocuments = HydratedDocument<GameTitle>;
@Schema()
export class GameTitle extends Document {
  @Prop({ unique: true })
  id: string;

  @Prop()
  gameFileLink: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  gamePlayScreenShots: string[];

  @Prop()
  gamePlayVideo: string;

  @Prop()
  genre: string[];

  @Prop()
  tags: string[];

  @Prop()
  targetPlatform: string[];

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: false })
  isOnSale: boolean;

  @Prop()
  price: number;

  @Prop()
  saleType: string;

  @Prop()
  releaseDate: Date;

  @Prop()
  legal: string;

  @Prop()
  ageRating: string;

  @Prop()
  developerId: string;

  @Prop()
  developerEmail: string;

  @Prop()
  gameRating: number;

  @Prop()
  gamePlays: number;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop()
  __v: number;
}

export const GameTitleSchema = SchemaFactory.createForClass(GameTitle);
