import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidRolesArgs } from './dto/args/role.arg';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';

import { Currentuser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

import { User } from './entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { List } from '../lists/entities/list.entity';

import { UpdateUserInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { ListsService } from './../lists/lists.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  // Todo: hacer que se pueda buscar por nombre de ususario (fullName)
  @Query(() => [User], { name: 'users', description: 'busca los usuarios' })
  findAll(
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    @Args() validRolesArgs: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<User[]> {
    return this.usersService.findAll(validRolesArgs.roles, paginationArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @Parent() user: User,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @Parent() user: User,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: 'listCount' })
  async listCount(
    @Parent() user: User,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
  ): Promise<number> {
    return this.listsService.listCountByUser(user);
  }

  @ResolveField(() => [List], { name: 'lists' })
  async getListsByUser(
    @Parent() user: User,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
