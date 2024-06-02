// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop()
  id: string;

  @Prop({ required: true })
  senderEmail: string;

  @Prop({ required: true })
  receiverEmail: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  transactionFee: number;

  @Prop({ default: false })
  isSuccessful: boolean;

  @Prop({ default: false })
  updatedAt: Date;

  @Prop({ default: false })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
