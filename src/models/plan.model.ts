import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Plan {
  @Prop({ type: String })
  type: 'basic' | 'standard' | 'premium';

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: String })
  title: string;

  @Prop({ type: Number })
  howLongToLaunch: number;

  @Prop({ type: Number })
  howManyCustomizations: number;

  @Prop({ type: Number })
  customizationCharge: number;

  @Prop({ type: Number })
  howManyLevels: number;

  @Prop({ type: Boolean })
  hasDocumentation: boolean;

  @Prop({ type: Boolean })
  hasAdminPanel: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
