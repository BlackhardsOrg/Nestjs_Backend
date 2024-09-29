import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'auctionInfo' })
export class AuctionInfoGQL {
  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field({ nullable: true })
  reservedPrice: number;
}
