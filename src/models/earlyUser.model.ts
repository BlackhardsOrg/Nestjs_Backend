import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type EarlyUserDocuments = HydratedDocument<EarlyUser>;

@Schema()
export class EarlyUser {
  @Prop({ type: String, required: true, unique: true, default: () => uuidv4() })
  id: string;

  @Prop({ default: '' })
  studioName: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: '' })
  yourPurpose: string; //Do you want to sell or buy?

  @Prop({ default: '' })
  portfolioLink: string; //Do you want to sell or buy?

  @Prop({ default: '' })
  yourRole: string; //Studio, Indie developer, Merchant, Trader

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;
}

export const EarlyUserSchema = SchemaFactory.createForClass(EarlyUser);
