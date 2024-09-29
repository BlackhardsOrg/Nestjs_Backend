import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class GameTitleAuction {
  @Prop({ type: String, default: 0 })
  startTime: string;

  @Prop({ type: String })
  endTime: string;

  @Prop({ type: Number })
  reservedPrice: number;
}

export const PlanSchema = SchemaFactory.createForClass(GameTitleAuction);
