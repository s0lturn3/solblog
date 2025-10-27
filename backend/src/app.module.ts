import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './shared/modules/common.module';

import { CommentsModule } from './features/comments/comments.module';
import { CommentEntity } from './features/comments/entities/comment.entity';
import { PostEntity } from './features/posts/entities/post.entity';
import { PostsModule } from './features/posts/posts.module';
import { TagEntity } from './features/tags/entities/tag.entity';
import { TagsModule } from './features/tags/tags.module';
import { UserEntity } from './features/users/entities/user.entity';
import { UsersModule } from './features/users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: `${(60 * 60)}s` },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),

        entities: [
          UserEntity,
          PostEntity,
          TagEntity,
          CommentEntity,
        ],
      })
    }),

    // Módulos de aplicação
    CommonModule,
    PostsModule,
    UsersModule,
    TagsModule,
    CommentsModule,
  ]
})
export class AppModule {  }
