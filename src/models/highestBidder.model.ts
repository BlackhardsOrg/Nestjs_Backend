import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type HighestBidderDocuments = HydratedDocument<HighestBidder>;

@Schema()
export class HighestBidder {
  @Prop()
  id: string;

  @Prop()
  bidderEmail: string;

  @Prop()
  bid: number;

  @Prop()
  bidTime: number;

  @Prop()
  auctionId: string;

  @Prop()
  confirmed: boolean;
  @Prop()
  updatedAt: Date;
  @Prop()
  createdAt: Date;
}

export const HighestBidderSchema = SchemaFactory.createForClass(HighestBidder);
