import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { PlanGQL } from './plan.gql.model';

@ObjectType({ description: 'gametitle' })
export class PlansGQL {
  @Field()
  basic: PlanGQL;

  @Field()
  standard: PlanGQL;

  @Field()
  premium: PlanGQL;
}
