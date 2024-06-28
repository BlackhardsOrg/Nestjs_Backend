import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocuments = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true, default: () => uuidv4() })
  id: string;

  @Prop({ default: '' })
  studioName: string;

  @Prop({ default: '' })
  studioDescription: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: [] })
  inventory: string[];

  @Prop()
  resetToken: string;

  @Prop()
  passwordHash: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  gamesInInventory: number;

  @Prop({ default: ['merchant', 'developer'] })
  roles: string[];

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
