import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'gametitle' })
export class PlanGQL {
  @Field()
  type: 'basic' | 'standard' | 'premium';

  @Field()
  price: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  howLongToLaunch: number;

  @Field()
  howManyCustomizations: number;

  @Field()
  customizationCharge: number;

  @Field()
  howManyLevels: number;

  @Field()
  hasDocumentation: boolean;

  @Field()
  hasAdminPanel: boolean;
}
