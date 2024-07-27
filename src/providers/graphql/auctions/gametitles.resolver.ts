import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NewRecipeInput } from './dto/new-gametitle.input';
import { RecipesArgs } from './dto/gametitles.args';
import { GametitleGQL } from './models/gametitle.gql.model';
import { GameTitleService } from 'src/providers/services/gameTitle.service';

const pubSub = new PubSub();

@Resolver((of) => GametitleGQL)
export class GameTitleResolver {
  constructor(private readonly gameTitlesService: GameTitleService) {}

  @Query((returns) => GametitleGQL)
  async gameTitle(@Args('id') id: string): Promise<GametitleGQL> {
    const gameTitle = await this.gameTitlesService.findGameTitleById(id);
    if (!gameTitle) {
      throw new NotFoundException(id);
    }
    return gameTitle;
  }

  @Query((returns) => [GametitleGQL])
  async userGameTitles(
    @Args() recipesArgs: RecipesArgs,
  ): Promise<GametitleGQL[]> {
    const gameTitles =
      await this.gameTitlesService.findGameTitlesByDeveloperEmail(
        recipesArgs.developerEmail,
      );
    console.log(gameTitles, 'HOSE');
    return gameTitles;
  }

  // @Mutation((returns) => GametitleGQL)
  // async addRecipe(
  //   @Args('newRecipeData') newRecipeData: NewRecipeInput,
  // ): Promise<GametitleGQL> {
  //   const recipe = await this.gameTitlesService.create(newRecipeData);
  //   pubSub.publish('recipeAdded', { recipeAdded: recipe });
  //   return recipe;
  // }

  // @Mutation((returns) => Boolean)
  // async removeRecipe(@Args('id') id: string) {
  //   return this.gameTitlesService.remove(id);
  // }

  // @Subscription((returns) => GametitleGQL)
  // recipeAdded() {
  //   return pubSub.asyncIterator('recipeAdded');
  // }
}
