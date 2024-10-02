import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { PaymentInfoGQL } from './paymentinfo.gql.model';
import { GametitleGQL } from '../../gametitle/models/gametitle.gql.model';
import { UserGQL } from '../../users/models/user.gql.model';

@ObjectType({ description: 'auction' })
export class BidHistoryGQL {
  @Field()
  id: string;

  @Field((type) => String, { nullable: true })
  bidderEmail?: string;

  @Field((type) => String, { nullable: true })
  sellerEmail?: string;

  @Field((type) => Number, { nullable: true })
  bid: number;

  @Field((type) => UserGQL, { nullable: true })
  bidder?: UserGQL;

  @Field((type) => UserGQL, { nullable: true })
  seller?: UserGQL;

  @Field({ nullable: true })
  auctionId: string;

  @Field({ nullable: true })
  confirmed: boolean;

  @Field({ nullable: true })
  createdAt: Date;

  @Field((type) => Number, { nullable: true })
  updatedAt: Date;
}
