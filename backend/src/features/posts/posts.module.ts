import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PostEntity } from './entities/post.entity';

import { SlugService } from 'src/shared/services/slug.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [ PostsController ],
  providers: [
    PostsService,
    UsersModule,
    SlugService
  ],
})
export class PostsModule {

  constructor( private _data: DataSource, private _slug: SlugService ) {
    PostEntity.configure(_slug, _data);
  }
  
}
