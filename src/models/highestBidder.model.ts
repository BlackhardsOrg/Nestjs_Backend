import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HighestBidderDocuments = HydratedDocument<HighestBidder>;

@Schema()
export class HighestBidder {
  @Prop()
  id: string;

  @Prop({ default: '' })
  bidderEmail: string;

  @Prop({ default: '' })
  sellerEmail: string;

  @Prop({ default: 0 })
  bid: number;

  @Prop()
  auctionId: string;

  @Prop()
  confirmed: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const HighestBidderSchema = SchemaFactory.createForClass(HighestBidder);
