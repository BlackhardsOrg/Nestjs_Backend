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
import { BidHistoryGQL } from './models/bidHistory.gql';
import { BidsHistoryService } from 'src/providers/services/bidHistory.service';

@Resolver((of) => BidHistoryGQL)
export class BidHistoryResolver {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly gameTitleService: GameTitleService,
    private readonly userService: UserService,
    private readonly bidHistoryService: BidsHistoryService,
  ) {}

  @Query((returns) => BidHistoryGQL)
  async bid(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BidHistoryGQL> {
    const bidHistory = await this.bidHistoryService.fetchSingleBidHistory(id);
    return bidHistory;
  }

  @Query((returns) => [BidHistoryGQL])
  async bids(
    @Args('auctionId', { type: () => String }) auctionId: string,
  ): Promise<BidHistoryGQL[]> {
    const bidHistories =
      await this.bidHistoryService.fetchBidHistories(auctionId);

    return bidHistories;
  }

  @Query((returns) => [BidHistoryGQL])
  async userBids(
    @Args('bidderEmail', { type: () => String }) bidderEmail: string,
  ): Promise<BidHistoryGQL[]> {
    const userBidHistories =
      await this.bidHistoryService.fetchUserBidHistories(bidderEmail);

    return userBidHistories;
  }

  @Query((returns) => BidHistoryGQL)
  async highestBidder(
    @Args('auctionId', { type: () => String }) auctionId: string,
  ): Promise<BidHistoryGQL> {
    const highestBidder =
      await this.bidHistoryService.fetchAnAuctionHighestBidder(auctionId);

    return highestBidder;
  }

  @ResolveField()
  async seller(@Parent() bidHistory: BidHistoryGQL): Promise<UserGQL> {
    const { sellerEmail } = bidHistory;
    const result = await this.userService.findOneByEmail(sellerEmail);
    return result;
  }

  @ResolveField()
  async bidder(@Parent() auction: BidHistoryGQL): Promise<UserGQL> {
    const { bidderEmail } = auction;
    const result = await this.userService.findOneByEmail(bidderEmail);

    return result;
  }
}
