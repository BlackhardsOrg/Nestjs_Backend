// invalidated-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class InvalidTokens extends Document {
  @Prop({ required: true, unique: true })
  token: string;
}

export const InvalidTokenSchema = SchemaFactory.createForClass(InvalidTokens);
