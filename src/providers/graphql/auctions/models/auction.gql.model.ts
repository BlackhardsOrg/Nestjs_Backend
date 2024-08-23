import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { PaymentInfoGQL } from './paymentinfo.gql.model';
import { GametitleGQL } from '../../gametitle/models/gametitle.gql.model';
import { UserGQL } from '../../users/models/user.gql.model';

@ObjectType({ description: 'gametitle' })
export class AuctionGQL {
  @Field()
  _id?: string;

  @Field()
  id: string;

  @Field()
  gameTitleId: string;

  @Field((type) => GametitleGQL, { nullable: true })
  gametitle?: GametitleGQL;

  @Field((type) => UserGQL, { nullable: true })
  developer?: UserGQL;

  @Field()
  sellerEmail: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field((type) => Number, { nullable: true })
  reservedPrice: number;

  @Field((type) => Boolean)
  started: boolean;

  @Field((type) => PaymentInfoGQL)
  paymentInfo: PaymentInfoGQL;

  @Field()
  resulterEmail: string;

  @Field((type) => Boolean)
  resulted: boolean;

  @Field()
  buyerEmail: string;

  @Field()
  walletAddress: string;

  @Field(() => Boolean)
  confirmed: boolean;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => Date)
  createdAt: Date;
}
