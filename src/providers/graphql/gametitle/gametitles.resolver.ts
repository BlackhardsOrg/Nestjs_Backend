import { NotFoundException } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { GametitleGQL } from './models/gametitle.gql.model';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { UserGQL } from '../users/models/user.gql.model';
import { UserService } from 'src/providers/services/user.service';
import { GameTitle } from 'src/models/gametitle.model';
import { GameTitleArgs } from './dto/gametitles.args';

@Resolver((of) => GametitleGQL)
export class GameTitleResolver {
  constructor(
    private readonly gameTitlesService: GameTitleService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => GametitleGQL)
  async gameTitle(
    @Args('id', { type: () => String }) id: string,
  ): Promise<GametitleGQL> {
    const gameTitle = await this.gameTitlesService.findGameTitleById(id);
    return gameTitle;
  }

  @Query((returns) => [GametitleGQL])
  async userGameTitles(
    @Args() gameTitleArgs: GameTitleArgs,
  ): Promise<GametitleGQL[]> {
    const gameTitles =
      await this.gameTitlesService.findGameTitlesByDeveloperEmail(
        gameTitleArgs.developerEmail,
      );
    console.log(gameTitles, 'HOLA ');
    return gameTitles;
  }

  @ResolveField()
  async developer(@Parent() gametitle: GametitleGQL): Promise<UserGQL> {
    const { developerEmail } = gametitle;
    return this.userService.findOneByEmail(developerEmail);
  }
}
