// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Notification);
