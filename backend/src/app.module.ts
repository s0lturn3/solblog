/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jwtConstants } from './shared/models/constants/constants';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    DevtoolsModule.register({ http: process.env.NODE_ENV !== 'production' }),

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
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

        // TODO: Estudar o porquê deste trecho não funcionar corretamente
        // entities: [join(process.cwd(), 'dist/**/*.entity.ts')],
        entities: [  ],
      })
    }),

    // Módulos de aplicação
    // [...]
  ]
})
export class AppModule {  }
