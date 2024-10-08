import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { GametitleGQL } from './models/gametitle.gql.model';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { UserGQL } from '../users/models/user.gql.model';
import { UserService } from 'src/providers/services/user.service';
import { AllGameTitleArgs, GameTitleArgs } from './dto/gametitles.args';
import { AuctionGQL } from '../auctions/models/auction.gql.model';
import { AuctionsService } from 'src/providers/services/auctions.service';

@Resolver((of) => GametitleGQL)
export class GameTitleResolver {
  constructor(
    private readonly gameTitlesService: GameTitleService,
    private readonly userService: UserService,
    private readonly auctionService: AuctionsService,
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
      await this.gameTitlesService.findGameTitlesByDeveloperEmailAndGenre(
        gameTitleArgs.developerEmail,
        {
          skip: gameTitleArgs.skip,
          take: gameTitleArgs.take,
          genre: gameTitleArgs.genre,
          priceMax: gameTitleArgs.priceMax,
          priceMin: gameTitleArgs.priceMin,
          tag: gameTitleArgs.tag,
          rating: gameTitleArgs.rating,
        },
      );
    return gameTitles;
  }

  @Query((returns) => [GametitleGQL])
  async allGameTitles(
    @Args() gameTitleArgs: AllGameTitleArgs,
  ): Promise<GametitleGQL[]> {
    const gameTitles = await this.gameTitlesService.fetchAllGameTitles({
      skip: gameTitleArgs.skip,
      take: gameTitleArgs.take,
      genre: gameTitleArgs.genre,
      priceMax: gameTitleArgs.priceMax,
      priceMin: gameTitleArgs.priceMin,
      tag: gameTitleArgs.tag,
      rating: gameTitleArgs.rating,
    });
    return gameTitles.data;
  }

  @ResolveField(() => UserGQL)
  async developer(@Parent() gametitle: GametitleGQL): Promise<UserGQL> {
    const { developerEmail } = gametitle;
    return this.userService.findOneByEmail(developerEmail);
  }

  @ResolveField(() => AuctionGQL)
  async auctionData(@Parent() gametitle: GametitleGQL): Promise<AuctionGQL> {
    const { auctionId } = gametitle;
    const auctionData =
      await this.auctionService.findAuctionByObjectId(auctionId);
    return auctionData;
  }
}
