import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { ValidRolesArgs } from './dto/args/role.arg';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Currentuser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @Currentuser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
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
}
