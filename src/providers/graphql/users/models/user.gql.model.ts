import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'gametitle' })
export class UserGQL {
  @Field()
  id: string;

  @Field()
  studioName: string;

  @Field()
  studioDescription: string;

  @Field()
  email: string;

  @Field()
  balance: number;

  @Field()
  inventory: string[];

  @Field()
  resetToken: string;

  @Field()
  passwordHash: string;

  @Field()
  emailVerified: boolean;

  @Field()
  isActive: boolean;

  @Field()
  gamesInInventory: number;

  @Field()
  roles: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
