import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { GametitleGQL } from '../../gametitle/models/gametitle.gql.model';

@ObjectType({ description: 'gametitle' })
export class GametitleInInventoryGQL {
  @Field((type) => ID)
  _id?: string;
  @Field((type) => ID)
  id: string;

  @Field()
  gameId: string;

  @Field((type) => GametitleGQL, { nullable: true })
  gametitle?: GametitleGQL;

  @Field()
  buyerEmail: string;

  @Field()
  packageType: string;

  @Field()
  packageTypeGameLink: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
