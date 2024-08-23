import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { PlansGQL } from './plans.gql.model';
import { UserGQL } from '../../users/models/user.gql.model';

@ObjectType({ description: 'gametitle' })
export class GametitleGQL {
  @Field((type) => ID)
  _id?: string;
  @Field((type) => ID)
  id: string;

  @Field()
  gameFileLink: string;

  @Field({ nullable: true })
  title: string;

  @Field()
  description: string;

  @Field((type) => [String], { nullable: true })
  gamePlayScreenShots: string[];

  @Field()
  gamePlayVideo: string;

  @Field((type) => [String])
  genre: string[];

  @Field((type) => [String])
  tags: string[];

  @Field((type) => [String])
  targetPlatform: string[];

  @Field()
  isApproved: boolean;

  @Field()
  isOnSale: boolean;

  @Field()
  price: number;

  @Field()
  saleType: string;

  @Field()
  releaseDate: Date;

  @Field()
  legal: string;

  @Field()
  ageRating: string;

  @Field()
  developerId: string;

  @Field()
  developerEmail?: string;

  @Field((type) => UserGQL)
  developer?: UserGQL;

  @Field()
  gameRating: number;

  @Field()
  gamePlays: number;

  @Field()
  isCustomizationEnabled?: boolean;

  @Field()
  customizationCharge?: number;

  @Field({ nullable: true })
  plans?: PlansGQL;

  @Field()
  isAIAllowedPricing: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
