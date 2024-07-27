import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NewRecipeInput } from './dto/new-user.input';
import { RecipesArgs } from './dto/users.args';
import { GameTitleService } from 'src/providers/services/gameTitle.service';
import { UserService } from 'src/providers/services/user.service';
import { UserGQL } from './models/user.gql.model';

const pubSub = new PubSub();

@Resolver((of) => UserGQL)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => UserGQL)
  async user(@Args('id') id: string): Promise<UserGQL> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Query((returns) => [UserGQL])
  async allUsers(@Args() recipesArgs: RecipesArgs): Promise<UserGQL[]> {
    const users = (await this.userService.FindAllUsers()).data;
    console.log(users, 'HOSE');
    return users;
  }
}
