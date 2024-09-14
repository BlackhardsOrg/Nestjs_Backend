import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { GameTitleService } from 'src/providers/services/gameTitle.service';

import { GametitleInInventoryGQL } from './models/gameTitleInInventory.gql.model';
import { GameInventoryArgs } from './dto/gametitlesInventory.args';
import { GametitleGQL } from '../gametitle/models/gametitle.gql.model';

@Resolver(() => GametitleInInventoryGQL)
export class GameInventoryResolver {
  constructor(private readonly gameTitlesService: GameTitleService) {}

  @Query((returns) => [GametitleInInventoryGQL])
  async fetchUserGamesInInventory(
    @Args() gameInventoryArgs: GameInventoryArgs,
  ): Promise<GametitleInInventoryGQL[]> {
    const gameTitles =
      await this.gameTitlesService.findGameTitlesInInventoryByDeveloperEmail(
        gameInventoryArgs.buyerEmail,
        {
          skip: gameInventoryArgs.skip,
          take: gameInventoryArgs.take,
        },
      );
    return gameTitles;
  }
  @ResolveField(() => GametitleGQL)
  async gametitle(
    @Parent() gametitleInventory: GametitleInInventoryGQL,
  ): Promise<GametitleGQL> {
    console.log(gametitleInventory, 'HOLD');

    const data = await this.gameTitlesService.findGameTitleById(
      gametitleInventory.gameId,
    );
    console.log(data, 'HOLD');
    return data;
  }
}
