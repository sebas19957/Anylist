import { UseGuards } from '@nestjs/common';

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { LoginInput, SignupInput } from './dto/inputs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

import { AuthResponse } from './types/auth-response.type';
import { Currentuser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResolver)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  signup(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @Currentuser(/**[ValidRoles.admin]**/) user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
