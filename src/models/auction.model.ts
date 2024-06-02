// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type HighestBidderDocuments = HydratedDocument<Auction>;
@Schema({ timestamps: true })
export class Auction extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  gameTitleId: string;

  @Prop({ required: true })
  sellerEmail: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  reservedPrice: number;

  @Prop({ required: true })
  started: boolean;

  @Prop({ required: true })
  resulted: boolean;

  @Prop({ required: true })
  buyerEmail: string;

  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: true })
  confirmed: boolean;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
