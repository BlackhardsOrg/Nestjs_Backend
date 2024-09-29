import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { GameTitleService } from 'src/providers/services/gameTitle.service';

import { RatingGQL } from './models/rating.gql.model';
import { RatingService } from 'src/providers/services/rating.service';
import { GametitleGQL } from '../gametitle/models/gametitle.gql.model';

@Resolver((of) => RatingGQL)
export class RatingResolver {
  constructor(
    private readonly gameTitlesService: GameTitleService,
    private readonly ratingService: RatingService,
  ) {}

  @Query((returns) => [RatingGQL])
  async fetchGameReviews(
    @Args('gameTitleId', { type: () => String }) gameTitleId: string,
  ): Promise<RatingGQL[]> {
    const reviews = await this.ratingService.getRatings(gameTitleId);
    return reviews;
  }

  @ResolveField()
  async gameTitle(@Parent() rating: RatingGQL): Promise<GametitleGQL> {
    const gameTitleResult = await this.gameTitlesService.fetchGameTitle(
      rating.gameTitleId,
    );
    return gameTitleResult.data;
  }
}
