import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'gametitle' })
export class PaymentInfoGQL {
  @Field((type) => Boolean)
  hasBuyerPaid: boolean;

  @Field()
  paymentReceipt: string;
  @Field()
  reference: string;
}
