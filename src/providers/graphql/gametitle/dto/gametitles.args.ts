import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class GameTitleArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field((type) => String)
  developerEmail;

  @Field((type) => Int, { nullable: true })
  priceMin;

  @Field((type) => Int, { nullable: true })
  priceMax;

  @Field((type) => Int, { nullable: true })
  rating;

  @Field((type) => String, { nullable: true })
  tag;

  @Field((type) => String, { nullable: true })
  genre;
}

@ArgsType()
export class AllGameTitleArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field((type) => Int, { nullable: true })
  priceMin;

  @Field((type) => Int, { nullable: true })
  priceMax;

  @Field((type) => Int, { nullable: true })
  rating;

  @Field((type) => String, { nullable: true })
  tag;

  @Field((type) => String, { nullable: true })
  genre;
}
