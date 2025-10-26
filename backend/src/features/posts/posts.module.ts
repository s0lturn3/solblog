import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PostEntity } from './entities/post.entity';

import { SlugService } from 'src/shared/services/slug.service';
import { TagEntity } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, UserEntity, TagEntity])
  ],
  controllers: [ PostsController ],
  providers: [
    PostsService,
    UsersService,
    TagsService,
    SlugService
  ],
})
export class PostsModule {

  constructor( private _data: DataSource, private _slug: SlugService ) {
    PostEntity.configure(_slug, _data);
  }
  
}
