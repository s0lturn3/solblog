import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './features/posts/entities/post.entity';
import { PostsModule } from './features/posts/posts.module';
import { User } from './features/users/entities/user.entity';
import { UsersModule } from './features/users/users.module';
import { CommonModule } from './shared/modules/common.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    DevtoolsModule.register({ http: process.env.NODE_ENV !== 'production' }),

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

        entities: [ User, Post ],
      })
    }),

    // Módulos de aplicação
    CommonModule,
    PostsModule,
    UsersModule,
  ]
})
export class AppModule {  }
