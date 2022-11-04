import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserInput } from './dto/inputs';

import { SignupInput } from '../auth/dto/inputs/singup.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UseService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.hableDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0)
      return this.usersRepository.find({
        // Todo: no es necesario porque tenemos lazy la propiedad lastUpdateBy
        // relations: {
        //   lastUpdateBy: true,
        // },
      });

    return this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string) {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload(updateUserInput);
      user.lastUpdateBy = updateBy;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.hableDBErrors(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save(userToBlock);
  }

  private hableDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    // if (error.code === 'error-001') {
    //   throw new BadRequestException(error.detail);
    // }

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
