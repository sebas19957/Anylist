import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

import { ListItemModule } from '../list-item/list-item.module';

import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List]), ListItemModule],
  exports: [TypeOrmModule, ListsService],
})
export class ListsModule {}
