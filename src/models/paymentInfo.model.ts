import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class PaymentInfo {
  @Prop({ type: Boolean, default: false })
  hasBuyerPaid: boolean;

  @Prop({ type: String, default: null })
  paymentReceipt: string;
  @Prop({ type: String, default: null })
  reference: string;
}

export const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);
