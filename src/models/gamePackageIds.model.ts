import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class GamePackageAndIds {
  @Prop({ type: String, default: false })
  id: string;

  @Prop({ type: String, default: false })
  packageType: string;
}

export const GamePackageAndIdsSchema =
  SchemaFactory.createForClass(GamePackageAndIds);
