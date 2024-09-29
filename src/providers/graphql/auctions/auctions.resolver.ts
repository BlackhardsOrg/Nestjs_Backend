import { NotFoundException } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { UserGQL } from '../users/models/user.gql.model';
import { UserService } from 'src/providers/services/user.service';
import { GameTitle } from 'src/models/gametitle.model';
import { AuctionGQL } from './models/auction.gql.model';
import { AuctionsService } from 'src/providers/services/auctions.service';
import { GameTitleArgs } from '../gametitle/dto/gametitles.args';
import { GametitleGQL } from '../gametitle/models/gametitle.gql.model';

@Resolver((of) => AuctionGQL)
export class AuctionResolver {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly gameTitleService: GameTitleService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => AuctionGQL)
  async auction(
    @Args('id', { type: () => String }) id: string,
  ): Promise<AuctionGQL> {
    const auction = await this.auctionsService.findAuctionById(id);
    return auction;
  }

  @Query((returns) => [AuctionGQL])
  async auctions(): Promise<AuctionGQL[]> {
    const auctions = await this.auctionsService.fetchAllAuctions();

    return auctions.data;
  }

  @Query((returns) => [AuctionGQL])
  async userAuctions(
    @Args('developerEmail', { type: () => String }) developerEmail: string,
  ): Promise<AuctionGQL[]> {
    const auctions = await this.auctionsService.fetchUserAuctions({
      developerEmail,
    });

    return auctions.data;
  }

  @ResolveField()
  async gametitle(@Parent() auction: AuctionGQL): Promise<GametitleGQL> {
    const { gameTitleId } = auction;
    const result = await this.gameTitleService.findGameTitleById(gameTitleId);

    return result;
  }

  @ResolveField()
  async developer(@Parent() auction: AuctionGQL): Promise<UserGQL> {
    const { sellerEmail } = auction;
    return this.userService.findOneByEmail(sellerEmail);
  }
}
