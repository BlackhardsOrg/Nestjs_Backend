import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Plan } from './plan.model';

@Schema({ _id: false })
export class Plans {
  @Prop({ type: Plan })
  basic: Plan;

  @Prop({ type: Plan })
  standard: Plan;

  @Prop({ type: Plan })
  premium: Plan;
}

export const PlansSchema = SchemaFactory.createForClass(Plans);
