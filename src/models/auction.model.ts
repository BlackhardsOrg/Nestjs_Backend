// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { boolean, number } from 'joi';
import { BooleanSchemaDefinition, Document, HydratedDocument } from 'mongoose';
import { PaymentInfo } from './paymentInfo.model';

export type HighestBidderDocuments = HydratedDocument<Auction>;

@Schema({ timestamps: true })
export class Auction extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  gameTitleId: string;

  @Prop({ required: true })
  sellerEmail: string;

  @Prop({ required: true, default: new Date() })
  startTime: string;

  @Prop({
    required: true,
    default: () => {
      const currentDate = Date.now();
      const futureDate = currentDate + 7 * 60 * 60 * 24;
      return new Date(futureDate);
    },
  })
  endTime: string;

  @Prop({ required: true })
  reservedPrice: number;

  @Prop({ default: false })
  started: boolean;

  @Prop({
    default: null,
    type: PaymentInfo,
  })
  paymentInfo: PaymentInfo;

  @Prop({ default: '' })
  resulterEmail: string;

  @Prop({ default: false })
  resulted: boolean;

  @Prop({ default: '' })
  buyerEmail: string;

  @Prop({ default: null })
  walletAddress: string;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
