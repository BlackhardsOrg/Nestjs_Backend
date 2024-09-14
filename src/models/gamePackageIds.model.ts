import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class GamePackageAndIds {
  @Prop({ type: String, default: '' })
  id: string;

  @Prop({ type: String, default: '' })
  packageType: string;

  @Prop({ type: String, default: 0 })
  price: string;
}

export const GamePackageAndIdsSchema =
  SchemaFactory.createForClass(GamePackageAndIds);
