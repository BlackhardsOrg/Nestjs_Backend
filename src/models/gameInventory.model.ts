import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type GameInventoryDocuments = HydratedDocument<GameInventory>;

@Schema()
export class GameInventory {
  @Prop({ type: String, required: true, unique: true, default: () => uuidv4() })
  id: string;

  @Prop({ unique: true })
  gameId: string;

  @Prop()
  buyerEmail: string;

  @Prop({ default: '' })
  packageType: string; //Do you want to sell or buy?

  @Prop({ default: '' })
  packageTypeGameLink: string; //Do you want to sell or buy?

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;
}

export const GameInventorySchema = SchemaFactory.createForClass(GameInventory);
