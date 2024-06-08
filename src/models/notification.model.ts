// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ unique: true })
  id: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop()
  senderId: string;

  @Prop()
  targetId: string;

  @Prop()
  reason: string;

  @Prop()
  amount: number;

  @Prop()
  type: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
