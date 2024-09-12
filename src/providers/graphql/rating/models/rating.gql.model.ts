import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { GametitleGQL } from '../../gametitle/models/gametitle.gql.model';

@ObjectType({ description: 'gametitle' })
export class RatingGQL {
  @Field((type) => ID)
  _id?: string;

  @Field((type) => ID)
  rating: number;

  @Field()
  gameTitleId: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  comment: string;

  @Field({ nullable: true })
  gameTitle?: GametitleGQL;

  @Field({ nullable: true })
  createdAt: Date;
}
