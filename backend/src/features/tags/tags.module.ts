import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { TagEntity } from './entities/tag.entity';

import { SlugService } from 'src/shared/services/slug.service';
import { PostEntity } from '../posts/entities/post.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity, PostEntity])
  ],
  controllers: [ TagsController ],
  providers: [
    TagsService,
    SlugService
  ],
})
export class TagsModule {

  constructor( private _data: DataSource, private _slug: SlugService ) {
    TagEntity.configure(_slug, _data);
  }

}
