import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HighestBidderDocuments = HydratedDocument<BidHistory>;

@Schema()
export class BidHistory {
  @Prop()
  id: string;

  @Prop({ default: '' })
  bidderEmail: string;

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

export const BidHistorySchema = SchemaFactory.createForClass(BidHistory);
