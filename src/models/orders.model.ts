// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GamePackageAndIds } from './gamePackageIds.model';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: String })
  id: string;

  @Prop()
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  companyName: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  houseNo: string;

  @Prop({ type: String })
  streetName: string;

  @Prop({ type: String })
  town: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  zip: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  walletAddress: string;

  @Prop({ type: String })
  additionalInfo: string;

  @Prop({ type: String })
  paymentType: string;

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({ type: String })
  email: string;

  @Prop({ type: [GamePackageAndIds] })
  GamePackageAndIds: GamePackageAndIds[];

  @Prop({ type: String })
  payStackOrderReference: string;

  @Prop({ type: String })
  transactionHash: string;

  @Prop({ type: Boolean, default: false })
  isFulfilled: boolean;

  @Prop({ type: Date, default: () => new Date().getDate() })
  updatedAt: Date;

  @Prop({ type: Date, default: () => new Date().getDate() })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
