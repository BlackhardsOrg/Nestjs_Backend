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
  resetToken: string;

  @Field()
  passwordHash: string;

  @Field()
  emailVerified: boolean;

  @Field()
  isActive: boolean;

  @Field((type) => [String])
  inventory: string[];

  @Field()
  gamesInInventory: number;

  @Field((type) => [String])
  roles: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
